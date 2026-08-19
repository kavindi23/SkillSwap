from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.notification_crud import create_notification
from app.crud.session_crud import (
    create_session,
    get_session_by_id,
    get_sessions_by_exchange,
    mark_session_completed,
)
from app.models.exchange import Exchange
from app.models.user import User
from app.schemas.session import SessionCreate


def schedule_session(
    db: Session,
    current_user: User,
    exchange_id: int,
    session_data: SessionCreate
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

    if exchange.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sessions can only be scheduled for active exchanges"
        )

    # Create session
    new_session = create_session(
        db=db,
        exchange_id=exchange.id,
        scheduled_by=current_user.id,
        title=session_data.title,
        session_date=session_data.session_date,
        start_time=session_data.start_time,
        duration_minutes=session_data.duration_minutes,
        session_type=session_data.session_type.value,
        meeting_link=session_data.meeting_link
    )

    # Find the other user in the exchange
    other_user_id = (
        exchange.user_b_id
        if current_user.id == exchange.user_a_id
        else exchange.user_a_id
    )

    # Notify the other user
    create_notification(
        db=db,
        user_id=other_user_id,
        notification_type="SESSION_SCHEDULED",
        title="New Session Scheduled",
        message=(
            f"{current_user.full_name} scheduled a new session: "
            f"{session_data.title}."
        )
    )

    return new_session


def get_exchange_sessions(
    db: Session,
    current_user: User,
    exchange_id: int
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

    return get_sessions_by_exchange(
        db=db,
        exchange_id=exchange_id
    )


def complete_session(
    db: Session,
    current_user: User,
    session_id: int
):
    session = get_session_by_id(
        db=db,
        session_id=session_id
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    exchange = (
        db.query(Exchange)
        .filter(Exchange.id == session.exchange_id)
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

    if session.status == "COMPLETED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session is already completed"
        )

    return mark_session_completed(
        db=db,
        session=session
    )