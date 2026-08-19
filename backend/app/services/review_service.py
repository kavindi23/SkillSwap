from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.review_crud import (
    create_review,
    get_review_by_exchange_and_reviewer,
    get_reviews_for_user,
    update_user_average_rating
)
from app.models.exchange import Exchange
from app.models.user import User
from app.schemas.review import ReviewCreate


def submit_review(
    db: Session,
    current_user: User,
    exchange_id: int,
    review_data: ReviewCreate
):
    exchange = (
        db.query(Exchange)
        .filter(Exchange.id == exchange_id)
        .first()
    )

    if exchange is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exchange not found"
        )

    if current_user.id not in [
        exchange.user_a_id,
        exchange.user_b_id
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this exchange"
        )

    if exchange.status != "COMPLETED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only review completed exchanges"
        )

    existing_review = get_review_by_exchange_and_reviewer(
        db=db,
        exchange_id=exchange.id,
        reviewer_id=current_user.id
    )

    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already reviewed this exchange"
        )

    reviewee_id = (
        exchange.user_b_id
        if current_user.id == exchange.user_a_id
        else exchange.user_a_id
    )

    review = create_review(
        db=db,
        exchange_id=exchange.id,
        reviewer_id=current_user.id,
        reviewee_id=reviewee_id,
        rating=review_data.rating,
        comment=review_data.comment
    )

    update_user_average_rating(
        db=db,
        user_id=reviewee_id
    )

    return review


def get_user_reviews(
    db: Session,
    user_id: int
):
    return get_reviews_for_user(
        db=db,
        user_id=user_id
    )