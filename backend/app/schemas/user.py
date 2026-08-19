from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)


class UserUpdate(BaseModel):
    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    bio: str | None = Field(
        default=None,
        max_length=500
    )

    university: str | None = Field(
        default=None,
        max_length=150
    )

    faculty: str | None = Field(
        default=None,
        max_length=150
    )

    department: str | None = Field(
        default=None,
        max_length=150
    )

    year: str | None = Field(
        default=None,
        max_length=50
    )

    location: str | None = Field(
        default=None,
        max_length=150
    )

    profile_image: str | None = Field(
        default=None,
        max_length=500
    )


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    bio: str | None = None
    university: str | None = None
    faculty: str | None = None
    department: str | None = None
    year: str | None = None
    location: str | None = None
    profile_image: str | None = None

    rating: float

    class Config:
        from_attributes = True