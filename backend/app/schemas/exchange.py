from pydantic import BaseModel, Field


class ExchangeRequestCreate(BaseModel):
    receiver_id: int
    offered_skill_id: int
    requested_skill_id: int

    message: str | None = Field(
        default=None,
        max_length=500
    )


class ExchangeRequestResponse(BaseModel):
    id: int

    sender_id: int
    sender_name: str | None = None

    receiver_id: int
    receiver_name: str | None = None

    offered_skill_id: int
    offered_skill_name: str | None = None

    requested_skill_id: int
    requested_skill_name: str | None = None

    message: str | None
    status: str

    class Config:
        from_attributes = True


class ExchangeResponse(BaseModel):
    id: int
    exchange_request_id: int

    user_a_id: int
    user_a_name: str

    user_b_id: int
    user_b_name: str

    status: str

    class Config:
        from_attributes = True