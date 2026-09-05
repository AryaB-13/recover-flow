from ai_agent import analyze_failed_payment

test_payment = {
    "customer_name": "Test Customer",
    "amount": 2999,
    "payment_method": "UPI",
    "failure_reason": "BANK_ERROR",
    "attempt_count": 0
}

decision = analyze_failed_payment(test_payment)

print("\nAI RECOVERY DECISION:")
print(decision)