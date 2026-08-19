from enum import Enum

from pydantic import BaseModel, Field


class SkillType(str, Enum):
    TEACH = "TEACH"
    LEARN = "LEARN"


class SkillLevel(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class SkillCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    category: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    skill_type: SkillType

    level: SkillLevel

    description: str | None = Field(
        default=None,
        max_length=500
    )


class SkillResponse(BaseModel):
    id: int

    name: str

    category: str

    skill_type: SkillType

    level: SkillLevel

    description: str | None

    class Config:
        from_attributes = True


class SkillUpdate(BaseModel):
    level: SkillLevel | None = None

    description: str | None = Field(
        default=None,
        max_length=500
    )