from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.skill_crud import (
    add_user_skill,
    create_skill,
    delete_user_skill,
    get_skill_by_name,
    get_user_skill,
    get_user_skill_by_id,
    get_user_skills,
    update_user_skill
)

from app.models.user import User
from app.schemas.skill import SkillCreate, SkillUpdate


def create_user_skill(
    db: Session,
    current_user: User,
    skill_data: SkillCreate
):
    skill = get_skill_by_name(
        db,
        skill_data.name
    )

    if skill is None:
        skill = create_skill(
            db=db,
            name=skill_data.name,
            category=skill_data.category
        )

    existing = get_user_skill(
        db=db,
        user_id=current_user.id,
        skill_id=skill.id,
        skill_type=skill_data.skill_type.value
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already added this skill."
        )

    add_user_skill(
        db=db,
        user_id=current_user.id,
        skill_id=skill.id,
        skill_type=skill_data.skill_type.value,
        level=skill_data.level.value,
        description=skill_data.description
    )

    return {
        "message": "Skill added successfully."
    }


def get_my_skills(
    db: Session,
    current_user: User
):
    records = get_user_skills(
        db=db,
        user_id=current_user.id
    )

    teach = []
    learn = []

    for user_skill, skill in records:
        item = {
            "id": user_skill.id,
            "skill_id": skill.id,
            "name": skill.name,
            "category": skill.category,
            "level": user_skill.level,
            "description": user_skill.description
        }

        if user_skill.skill_type == "TEACH":
            teach.append(item)
        else:
            learn.append(item)

    return {
        "teach": teach,
        "learn": learn
    }


def update_my_skill(
    db: Session,
    current_user: User,
    user_skill_id: int,
    skill_data: SkillUpdate
):
    user_skill = get_user_skill_by_id(
        db=db,
        user_skill_id=user_skill_id,
        user_id=current_user.id
    )

    if user_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    update_data = skill_data.model_dump(
        exclude_unset=True
    )

    if "level" in update_data:
        update_data["level"] = update_data["level"].value

    updated_skill = update_user_skill(
        db=db,
        user_skill=user_skill,
        update_data=update_data
    )

    return {
        "message": "Skill updated successfully",
        "id": updated_skill.id
    }


def remove_my_skill(
    db: Session,
    current_user: User,
    user_skill_id: int
):
    user_skill = get_user_skill_by_id(
        db=db,
        user_skill_id=user_skill_id,
        user_id=current_user.id
    )

    if user_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    delete_user_skill(
        db=db,
        user_skill=user_skill
    )

    return {
        "message": "Skill deleted successfully"
    }