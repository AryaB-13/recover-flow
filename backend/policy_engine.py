def apply_recovery_policy(payment: dict, ai_decision: dict):
    """
    Validates the AI recommendation against deterministic
    RecoverFlow recovery rules.
    """

    ai_action = ai_decision["action"]
    confidence = ai_decision["confidence"]

    failure_reason = payment["failure_reason"].upper()
    attempt_count = payment["attempt_count"]
    amount = payment["amount"]

    # Rule 1: Customer intentionally cancelled
    if failure_reason in ["CUSTOMER_CANCELLED", "CUSTOMER_REQUESTED_CANCELLATION"]:
        return {
            "final_action": "STOP",
            "policy_reason": "Customer cancellation must not be automatically recovered.",
            "ai_action": ai_action,
            "overridden": ai_action != "STOP"
        }

    # Rule 2: Fraud/risk failures require human review
    if failure_reason in ["FRAUD", "FRAUD_BLOCK", "RISK_BLOCK"]:
        return {
            "final_action": "ESCALATE",
            "policy_reason": "Risk-related payment failures require human review.",
            "ai_action": ai_action,
            "overridden": ai_action != "ESCALATE"
        }

    # Rule 3: Don't repeatedly retry a payment
    if attempt_count >= 3 and ai_action == "RETRY":
        return {
            "final_action": "ESCALATE",
            "policy_reason": "Maximum automatic retry attempts reached.",
            "ai_action": ai_action,
            "overridden": True
        }

    # Rule 4: Low-confidence AI decisions require review
    if confidence < 0.70:
        return {
            "final_action": "ESCALATE",
            "policy_reason": "AI confidence is below the automatic-action threshold.",
            "ai_action": ai_action,
            "overridden": ai_action != "ESCALATE"
        }

    # Rule 5: High-value payments get additional protection
    if amount >= 50000 and ai_action == "RETRY":
        return {
            "final_action": "ESCALATE",
            "policy_reason": "High-value payment requires human review before retry.",
            "ai_action": ai_action,
            "overridden": True
        }

    # AI recommendation passes all policies
    return {
        "final_action": ai_action,
        "policy_reason": "AI recommendation passed all recovery policies.",
        "ai_action": ai_action,
        "overridden": False
    }