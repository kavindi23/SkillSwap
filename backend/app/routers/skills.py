from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.skill import SkillCreate, SkillUpdate
from app.services.skill_service import create_user_skill




from app.services.skill_service import (
    create_user_skill,
    get_my_skills,
    remove_my_skill,
    update_my_skill
)


router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.post("/")
def add_skill(
    skill: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_user_skill(
        db=db,
        current_user=current_user,
        skill_data=skill
    )


@router.get("/me")
def view_my_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_my_skills(
        db=db,
        current_user=current_user
    )


@router.patch("/{user_skill_id}")
def update_skill(
    user_skill_id: int,
    skill_data: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_my_skill(
        db=db,
        current_user=current_user,
        user_skill_id=user_skill_id,
        skill_data=skill_data
    )


@router.delete("/{user_skill_id}")
def delete_skill(
    user_skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return remove_my_skill(
        db=db,
        current_user=current_user,
        user_skill_id=user_skill_id
    )