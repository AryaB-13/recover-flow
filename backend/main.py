from policy_engine import apply_recovery_policy
from recovery_executor import execute_recovery_action, complete_recovery_action
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ai_agent import analyze_failed_payment
from schemas import PaymentCreate
from database import supabase


app = FastAPI(
    title="RecoverFlow API",
    description="AI-powered autonomous revenue recovery engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "RecoverFlow API is running",
        "status": "healthy"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.get("/payments")
def get_payments():
    try:
        response = (
            supabase
            .table("payments")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "payments": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch payments: {str(e)}"
        )

@app.get("/decisions")
def get_decisions():
    try:
        response = (
            supabase
            .table("recovery_decisions")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "decisions": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch recovery decisions: {str(e)}"
        ) 

@app.get("/executions")
def get_executions():
    try:
        response = (
            supabase
            .table("recovery_executions")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "executions": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch recovery executions: {str(e)}"
        )       

@app.post("/payments")
def create_payment(payment: PaymentCreate):
    try:
        # 1. Prepare failed payment data
        payment_data = {
            "customer_name": payment.customer_name,
            "customer_email": payment.customer_email,
            "amount": payment.amount,
            "payment_method": payment.payment_method,
            "failure_reason": payment.failure_reason,
            "attempt_count": payment.attempt_count,
            "status": "failed"
        }

        # 2. Store failed payment in Supabase
        response = (
            supabase
            .table("payments")
            .insert(payment_data)
            .execute()
        )

        payment_id = response.data[0]["id"]

        # 3. Ask AI agent what recovery action should be taken
        ai_decision = analyze_failed_payment(payment_data)

        # 4. Validate AI recommendation using policy engine
        policy_result = apply_recovery_policy(
            payment_data,
            ai_decision
        )

        # 5. Execute the policy-approved recovery action
        execution_result = execute_recovery_action(
            payment_data,
            policy_result
        )

        # 6. Store AI + policy decision
        decision_data = {
            "payment_id": payment_id,
            "action": ai_decision["action"],
            "confidence": ai_decision["confidence"],
            "reasoning": ai_decision["reasoning"],
            "retry_after_minutes": ai_decision["retry_after_minutes"],
            "final_action": policy_result["final_action"],
            "policy_reason": policy_result["policy_reason"],
            "overridden": policy_result["overridden"]
        }

        decision_response = (
            supabase
            .table("recovery_decisions")
            .insert(decision_data)
            .execute()
        )

        decision_id = decision_response.data[0]["id"]

        # 7. Store execution history
        execution_data = {
            "payment_id": payment_id,
            "decision_id": decision_id,
            "action": execution_result["action"],
            "status": execution_result["status"],
            "message": execution_result["message"]
        }

        execution_response = (
            supabase
            .table("recovery_executions")
            .insert(execution_data)
            .execute()
        )

        # 8. Return complete recovery pipeline result
        return {
            "message": "Failed payment stored, analyzed and processed successfully",
            "payment": response.data,
            "ai_decision": decision_response.data,
            "policy_result": policy_result,
            "execution_result": execution_response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process payment: {str(e)}"
        )

@app.post("/executions/{execution_id}/complete")
def complete_execution(execution_id: int, success: bool):
    try:
        execution_response = (
            supabase
            .table("recovery_executions")
            .select("*")
            .eq("id", execution_id)
            .single()
            .execute()
        )

        execution = execution_response.data

        if not execution:
            raise HTTPException(
                status_code=404,
                detail="Recovery execution not found"
            )

        result = complete_recovery_action(
            execution["action"],
            success
        )

        updated_execution = (
            supabase
            .table("recovery_executions")
            .update({
                "status": result["status"],
                "message": result["message"]
            })
            .eq("id", execution_id)
            .execute()
        )

        if result["status"] == "recovered":
            (
                supabase
                .table("payments")
                .update({"status": "recovered"})
                .eq("id", execution["payment_id"])
                .execute()
            )

        return {
            "message": "Recovery execution completed",
            "execution": updated_execution.data
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to complete recovery: {str(e)}"
        )    