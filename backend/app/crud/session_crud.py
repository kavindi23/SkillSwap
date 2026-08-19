from sqlalchemy.orm import Session as DBSession

from app.models.session import Session


def create_session(
    db: DBSession,
    exchange_id: int,
    scheduled_by: int,
    title: str,
    session_date,
    start_time: str,
    duration_minutes: int,
    session_type: str,
    meeting_link: str | None
):
    session = Session(
        exchange_id=exchange_id,
        scheduled_by=scheduled_by,
        title=title,
        session_date=session_date,
        start_time=start_time,
        duration_minutes=duration_minutes,
        session_type=session_type,
        meeting_link=meeting_link,
        status="SCHEDULED"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def get_sessions_by_exchange(
    db: DBSession,
    exchange_id: int
):
    return (
        db.query(Session)
        .filter(Session.exchange_id == exchange_id)
        .order_by(
            Session.session_date.asc()
        )
        .all()
    )


def get_session_by_id(
    db: DBSession,
    session_id: int
):
    return (
        db.query(Session)
        .filter(Session.id == session_id)
        .first()
    )


def mark_session_completed(
    db: DBSession,
    session: Session
):
    session.status = "COMPLETED"

    db.commit()
    db.refresh(session)

    return session