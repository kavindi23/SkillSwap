from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.review import Review
from app.models.user import User


def get_review_by_exchange_and_reviewer(
    db: Session,
    exchange_id: int,
    reviewer_id: int
):
    return (
        db.query(Review)
        .filter(
            Review.exchange_id == exchange_id,
            Review.reviewer_id == reviewer_id
        )
        .first()
    )


def create_review(
    db: Session,
    exchange_id: int,
    reviewer_id: int,
    reviewee_id: int,
    rating: int,
    comment: str | None
):
    review = Review(
        exchange_id=exchange_id,
        reviewer_id=reviewer_id,
        reviewee_id=reviewee_id,
        rating=rating,
        comment=comment
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review


def update_user_average_rating(
    db: Session,
    user_id: int
):
    average_rating = (
        db.query(func.avg(Review.rating))
        .filter(Review.reviewee_id == user_id)
        .scalar()
    )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is not None:
        user.rating = float(average_rating or 0)

        db.commit()
        db.refresh(user)

    return user


def get_reviews_for_user(
    db: Session,
    user_id: int
):
    return (
        db.query(Review)
        .filter(Review.reviewee_id == user_id)
        .order_by(Review.created_at.desc())
        .all()
    )