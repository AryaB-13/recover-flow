def execute_recovery_action(payment, policy_result):
    action = policy_result["final_action"]

    if action == "RETRY":
        return {
            "action": "RETRY",
            "status": "scheduled",
            "message": "Payment retry has been scheduled."
        }

    elif action == "SEND_REMINDER":
        return {
            "action": "SEND_REMINDER",
            "status": "completed",
            "message": f"Payment reminder simulated for {payment['customer_email']}."
        }

    elif action == "ESCALATE":
        return {
            "action": "ESCALATE",
            "status": "completed",
            "message": "Payment has been escalated for manual review."
        }

    elif action == "STOP":
        return {
            "action": "STOP",
            "status": "completed",
            "message": "Recovery attempts have been stopped."
        }

    elif action == "WAIT":
        return {
            "action": "WAIT",
            "status": "scheduled",
            "message": "Recovery has been temporarily delayed."
        }

    return {
        "action": action,
        "status": "skipped",
        "message": "No supported recovery action was found."
    }
def complete_recovery_action(action, success):
    if success:
        return {
            "action": action,
            "status": "recovered",
            "message": "Payment successfully recovered."
        }

    return {
        "action": action,
        "status": "failed",
        "message": "Recovery attempt failed."
    }