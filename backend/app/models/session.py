from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.db.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    exchange_id = Column(
        Integer,
        ForeignKey("exchanges.id", ondelete="CASCADE"),
        nullable=False
    )

    scheduled_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    title = Column(
        String(150),
        nullable=False
    )

    session_date = Column(
        Date,
        nullable=False
    )

    start_time = Column(
        String(10),
        nullable=False
    )

    duration_minutes = Column(
        Integer,
        nullable=False
    )

    session_type = Column(
        String(20),
        nullable=False
    )

    meeting_link = Column(
        String(500),
        nullable=True
    )

    status = Column(
        String(20),
        default="SCHEDULED",
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )