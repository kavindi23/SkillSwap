from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String
from sqlalchemy.sql import func

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False, index=True)

    password = Column(String(255), nullable=False)

    role = Column(String(20), default="student")

    is_active = Column(
    Boolean,
    default=True,
    nullable=False
)

    bio = Column(String(500), nullable=True)

    university = Column(String(150), nullable=True)

    faculty = Column(String(150), nullable=True)

    department = Column(String(150), nullable=True)

    year = Column(String(50), nullable=True)

    location = Column(String(150), nullable=True)

    profile_image = Column(String(500), nullable=True)

    rating = Column(Float, default=0.0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

