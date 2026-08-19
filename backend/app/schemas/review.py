from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    rating: int = Field(
        ...,
        ge=1,
        le=5
    )

    comment: str | None = Field(
        default=None,
        max_length=500
    )


class ReviewResponse(BaseModel):
    id: int
    exchange_id: int
    reviewer_id: int
    reviewee_id: int
    rating: int
    comment: str | None

    class Config:
        from_attributes = True