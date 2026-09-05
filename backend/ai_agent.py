import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing")

client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_failed_payment(payment: dict):
    prompt = f"""
You are the AI recovery decision engine for RecoverFlow.

Analyze this failed payment:

Customer: {payment['customer_name']}
Amount: INR {payment['amount']}
Payment method: {payment['payment_method']}
Failure reason: {payment['failure_reason']}
Previous attempts: {payment['attempt_count']}

Choose exactly ONE recovery action:
RETRY
WAIT
SEND_REMINDER
ESCALATE
STOP

Return ONLY valid JSON in this exact format:

{{
    "action": "RETRY",
    "confidence": 0.90,
    "reasoning": "Short explanation of why this action is appropriate",
    "retry_after_minutes": 30
}}

Rules:
- confidence must be between 0 and 1.
- retry_after_minutes must be an integer or null.
- Do not include markdown.
- Do not include text outside the JSON.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return json.loads(response.text)