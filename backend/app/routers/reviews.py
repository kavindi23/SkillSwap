from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.review_service import (
    get_user_reviews,
    submit_review
)

router = APIRouter(
    tags=["Reviews"]
)


@router.post(
    "/exchanges/{exchange_id}/reviews",
    response_model=ReviewResponse,
    status_code=201
)
def create_review(
    exchange_id: int,
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return submit_review(
        db=db,
        current_user=current_user,
        exchange_id=exchange_id,
        review_data=review_data
    )


@router.get(
    "/users/{user_id}/reviews",
    response_model=list[ReviewResponse]
)
def get_reviews(
    user_id: int,
    db: Session = Depends(get_db)
):
    return get_user_reviews(
        db=db,
        user_id=user_id
    )