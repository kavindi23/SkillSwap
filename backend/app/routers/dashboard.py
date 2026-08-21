from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User

from app.services.skill_service import get_my_skills
from app.services.exchange_service import get_my_exchanges
from app.services.match_service import find_matches


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skills = get_my_skills(
        db=db,
        current_user=current_user,
    )

    exchanges = get_my_exchanges(
        db=db,
        current_user=current_user,
    )

    matches = find_matches(
        db=db,
        current_user=current_user,
    )

    profile = {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "bio": current_user.bio,
        "university": current_user.university,
        "faculty": current_user.faculty,
        "department": current_user.department,
        "year": current_user.year,
        "location": current_user.location,
        "rating": current_user.rating,
        "is_active": current_user.is_active,
    }

    return {
        "profile": profile,
        "skills": skills,
        "exchanges": exchanges,
        "matches": matches,
    }