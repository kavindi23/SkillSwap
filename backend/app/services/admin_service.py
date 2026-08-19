from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.exchange import Exchange
from app.models.review import Review
from app.models.session import Session as SkillSession
from app.models.skill import Skill
from app.models.user import User


def get_dashboard_stats(db: Session):
    total_users = db.query(User).count()

    total_skills = db.query(Skill).count()

    total_exchanges = db.query(Exchange).count()

    active_exchanges = (
        db.query(Exchange)
        .filter(Exchange.status == "ACTIVE")
        .count()
    )

    completed_exchanges = (
        db.query(Exchange)
        .filter(Exchange.status == "COMPLETED")
        .count()
    )

    total_sessions = db.query(SkillSession).count()

    total_reviews = db.query(Review).count()

    return {
        "total_users": total_users,
        "total_skills": total_skills,
        "total_exchanges": total_exchanges,
        "active_exchanges": active_exchanges,
        "completed_exchanges": completed_exchanges,
        "total_sessions": total_sessions,
        "total_reviews": total_reviews,
    }


def get_all_users(db: Session):
    return (
        db.query(User)
        .order_by(User.id.asc())
        .all()
    )


def change_user_status(
    db: Session,
    user_id: int,
    is_active: bool,
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_active = is_active

    db.commit()
    db.refresh(user)

    return user


def get_all_exchanges(db: Session):
    exchanges = (
        db.query(Exchange)
        .order_by(Exchange.id.asc())
        .all()
    )

    results = []

    for exchange in exchanges:
        user_a = (
            db.query(User)
            .filter(User.id == exchange.user_a_id)
            .first()
        )

        user_b = (
            db.query(User)
            .filter(User.id == exchange.user_b_id)
            .first()
        )

        session_count = (
            db.query(SkillSession)
            .filter(
                SkillSession.exchange_id == exchange.id
            )
            .count()
        )

        review_count = (
            db.query(Review)
            .filter(
                Review.exchange_id == exchange.id
            )
            .count()
        )

        results.append(
            {
                "id": exchange.id,
                "exchange_request_id": exchange.exchange_request_id,

                "user_a_id": exchange.user_a_id,
                "user_a_name": (
                    user_a.full_name
                    if user_a
                    else "Unknown User"
                ),

                "user_b_id": exchange.user_b_id,
                "user_b_name": (
                    user_b.full_name
                    if user_b
                    else "Unknown User"
                ),

                "status": exchange.status,
                "session_count": session_count,
                "review_count": review_count,
            }
        )

    return results