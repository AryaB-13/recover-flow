from recovery_executor import execute_recovery_action

test_payment = {
    "customer_name": "Test Customer",
    "customer_email": "test@example.com",
    "amount": 2999,
    "payment_method": "UPI",
    "failure_reason": "BANK_ERROR",
    "attempt_count": 0
}

test_policy_result = {
    "final_action": "SEND_REMINDER",
    "policy_reason": "AI recommendation passed all recovery policies.",
    "ai_action": "SEND_REMINDER",
    "overridden": False
}

result = execute_recovery_action(
    test_payment,
    test_policy_result
)

print("\nRECOVERY EXECUTOR RESULT:")
print(result)