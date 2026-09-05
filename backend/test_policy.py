from policy_engine import apply_recovery_policy

test_payment = {
    "amount": 2999,
    "failure_reason": "FRAUD_BLOCK",
    "attempt_count": 0
}

test_ai_decision = {
    "action": "RETRY",
    "confidence": 0.88,
    "reasoning": "Temporary bank error",
    "retry_after_minutes": 15
}

result = apply_recovery_policy(test_payment, test_ai_decision)

print("\nPOLICY ENGINE RESULT:")
print(result)