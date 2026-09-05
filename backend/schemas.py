from pydantic import BaseModel


class PaymentCreate(BaseModel):
    customer_name: str
    customer_email: str
    amount: float
    payment_method: str
    failure_reason: str
    attempt_count: int = 0