from datetime import date
from enum import Enum

from pydantic import BaseModel, Field


class SessionType(str, Enum):
    ONLINE = "ONLINE"
    PHYSICAL = "PHYSICAL"


class SessionCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=2,
        max_length=150
    )

    session_date: date

    start_time: str = Field(
        ...,
        min_length=5,
        max_length=5
    )

    duration_minutes: int = Field(
        ...,
        ge=15,
        le=480
    )

    session_type: SessionType

    meeting_link: str | None = Field(
        default=None,
        max_length=500
    )


class SessionResponse(BaseModel):
    id: int
    exchange_id: int
    scheduled_by: int
    title: str
    session_date: date
    start_time: str
    duration_minutes: int
    session_type: str
    meeting_link: str | None
    status: str

    class Config:
        from_attributes = True