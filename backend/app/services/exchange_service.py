from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.exchange_crud import (
    complete_exchange,
    create_exchange,
    create_exchange_request,
    get_exchange_by_request_id,
    get_exchange_request_by_id,
    get_pending_exchange_request,
    get_received_exchange_requests,
    get_sent_exchange_requests,
    get_user_exchanges,
    update_exchange_request_status,
)

from app.crud.notification_crud import create_notification

from app.models.exchange import Exchange
from app.models.session import Session
from app.models.skill import Skill, UserSkill
from app.models.user import User

from app.schemas.exchange import ExchangeRequestCreate


def send_exchange_request(
    db: Session,
    current_user: User,
    request_data: ExchangeRequestCreate
):
    # Cannot send a request to yourself
    if current_user.id == request_data.receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot send an exchange request to yourself"
        )

    # Check receiver exists
    receiver = (
        db.query(User)
        .filter(User.id == request_data.receiver_id)
        .first()
    )

    if receiver is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )

    # Sender must TEACH the offered skill
    sender_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_id == request_data.offered_skill_id,
            UserSkill.skill_type == "TEACH"
        )
        .first()
    )

    if sender_skill is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot offer this skill"
        )

    # Receiver must TEACH the requested skill
    receiver_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == request_data.receiver_id,
            UserSkill.skill_id == request_data.requested_skill_id,
            UserSkill.skill_type == "TEACH"
        )
        .first()
    )

    if receiver_skill is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Receiver does not teach the requested skill"
        )

    # Prevent duplicate pending requests
    existing_request = get_pending_exchange_request(
        db=db,
        sender_id=current_user.id,
        receiver_id=request_data.receiver_id,
        offered_skill_id=request_data.offered_skill_id,
        requested_skill_id=request_data.requested_skill_id
    )

    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A pending exchange request already exists"
        )

    # Create exchange request
    exchange_request = create_exchange_request(
        db=db,
        sender_id=current_user.id,
        receiver_id=request_data.receiver_id,
        offered_skill_id=request_data.offered_skill_id,
        requested_skill_id=request_data.requested_skill_id,
        message=request_data.message
    )

    # Notify receiver
    create_notification(
        db=db,
        user_id=request_data.receiver_id,
        notification_type="EXCHANGE_REQUEST",
        title="New Exchange Request",
        message=(
            f"{current_user.full_name} sent you "
            f"a skill exchange request."
        )
    )

    return exchange_request


def get_my_received_requests(
    db: Session,
    current_user: User
):
    requests = get_received_exchange_requests(
        db=db,
        receiver_id=current_user.id
    )

    results = []

    for request in requests:
        sender = (
            db.query(User)
            .filter(User.id == request.sender_id)
            .first()
        )

        receiver = (
            db.query(User)
            .filter(User.id == request.receiver_id)
            .first()
        )

        offered_skill = (
            db.query(Skill)
            .filter(Skill.id == request.offered_skill_id)
            .first()
        )

        requested_skill = (
            db.query(Skill)
            .filter(Skill.id == request.requested_skill_id)
            .first()
        )

        results.append(
            {
                "id": request.id,

                "sender_id": request.sender_id,
                "sender_name": (
                    sender.full_name
                    if sender
                    else "Unknown User"
                ),

                "receiver_id": request.receiver_id,
                "receiver_name": (
                    receiver.full_name
                    if receiver
                    else "Unknown User"
                ),

                "offered_skill_id": request.offered_skill_id,
                "offered_skill_name": (
                    offered_skill.name
                    if offered_skill
                    else "Unknown Skill"
                ),

                "requested_skill_id": request.requested_skill_id,
                "requested_skill_name": (
                    requested_skill.name
                    if requested_skill
                    else "Unknown Skill"
                ),

                "message": request.message,
                "status": request.status
            }
        )

    return results


def get_my_sent_requests(
    db: Session,
    current_user: User
):
    requests = get_sent_exchange_requests(
        db=db,
        sender_id=current_user.id
    )

    results = []

    for request in requests:
        sender = (
            db.query(User)
            .filter(User.id == request.sender_id)
            .first()
        )

        receiver = (
            db.query(User)
            .filter(User.id == request.receiver_id)
            .first()
        )

        offered_skill = (
            db.query(Skill)
            .filter(Skill.id == request.offered_skill_id)
            .first()
        )

        requested_skill = (
            db.query(Skill)
            .filter(Skill.id == request.requested_skill_id)
            .first()
        )

        results.append(
            {
                "id": request.id,

                "sender_id": request.sender_id,
                "sender_name": (
                    sender.full_name
                    if sender
                    else "Unknown User"
                ),

                "receiver_id": request.receiver_id,
                "receiver_name": (
                    receiver.full_name
                    if receiver
                    else "Unknown User"
                ),

                "offered_skill_id": request.offered_skill_id,
                "offered_skill_name": (
                    offered_skill.name
                    if offered_skill
                    else "Unknown Skill"
                ),

                "requested_skill_id": request.requested_skill_id,
                "requested_skill_name": (
                    requested_skill.name
                    if requested_skill
                    else "Unknown Skill"
                ),

                "message": request.message,
                "status": request.status
            }
        )

    return results


def accept_exchange_request(
    db: Session,
    current_user: User,
    request_id: int
):
    exchange_request = get_exchange_request_by_id(
        db=db,
        request_id=request_id
    )

    if exchange_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exchange request not found"
        )

    if exchange_request.receiver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to accept this request"
        )

    if exchange_request.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be accepted"
        )

    # Update request status
    updated_request = update_exchange_request_status(
        db=db,
        exchange_request=exchange_request,
        new_status="ACCEPTED"
    )

    # Create active exchange if one does not already exist
    existing_exchange = get_exchange_by_request_id(
        db=db,
        exchange_request_id=updated_request.id
    )

    if existing_exchange is None:
        create_exchange(
            db=db,
            exchange_request_id=updated_request.id,
            user_a_id=updated_request.sender_id,
            user_b_id=updated_request.receiver_id
        )

    # Notify sender
    create_notification(
        db=db,
        user_id=updated_request.sender_id,
        notification_type="REQUEST_ACCEPTED",
        title="Exchange Request Accepted",
        message=(
            f"{current_user.full_name} accepted "
            f"your skill exchange request."
        )
    )

    return updated_request


def reject_exchange_request(
    db: Session,
    current_user: User,
    request_id: int
):
    exchange_request = get_exchange_request_by_id(
        db=db,
        request_id=request_id
    )

    if exchange_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exchange request not found"
        )

    if exchange_request.receiver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to reject this request"
        )

    if exchange_request.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be rejected"
        )

    # Update request status
    updated_request = update_exchange_request_status(
        db=db,
        exchange_request=exchange_request,
        new_status="REJECTED"
    )

    # Notify sender
    create_notification(
        db=db,
        user_id=updated_request.sender_id,
        notification_type="REQUEST_REJECTED",
        title="Exchange Request Rejected",
        message=(
            f"{current_user.full_name} rejected "
            f"your skill exchange request."
        )
    )

    return updated_request


def get_my_exchanges(
    db: Session,
    current_user: User
):
    # Get all exchanges that belong to logged-in user
    exchanges = get_user_exchanges(
        db=db,
        user_id=current_user.id
    )

    results = []

    for exchange in exchanges:

        # Get User A
        user_a = (
            db.query(User)
            .filter(User.id == exchange.user_a_id)
            .first()
        )

        # Get User B
        user_b = (
            db.query(User)
            .filter(User.id == exchange.user_b_id)
            .first()
        )

        results.append(
            {
                "id": exchange.id,

                "exchange_request_id":
                    exchange.exchange_request_id,

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

                "status": exchange.status
            }
        )

    return results


def complete_my_exchange(
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

    if exchange.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only active exchanges can be completed"
        )

    sessions = (
        db.query(Session)
        .filter(Session.exchange_id == exchange_id)
        .all()
    )

    if not sessions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exchange must have at least one session"
        )

    incomplete_session = any(
        session.status != "COMPLETED"
        for session in sessions
    )

    if incomplete_session:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Complete all sessions before "
                "completing the exchange"
            )
        )

    return complete_exchange(
        db=db,
        exchange=exchange
    )