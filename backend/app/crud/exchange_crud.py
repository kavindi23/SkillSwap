from sqlalchemy.orm import Session

from app.models.exchange import Exchange, ExchangeRequest


def create_exchange_request(
    db: Session,
    sender_id: int,
    receiver_id: int,
    offered_skill_id: int,
    requested_skill_id: int,
    message: str | None
):
    exchange_request = ExchangeRequest(
        sender_id=sender_id,
        receiver_id=receiver_id,
        offered_skill_id=offered_skill_id,
        requested_skill_id=requested_skill_id,
        message=message,
        status="PENDING"
    )

    db.add(exchange_request)
    db.commit()
    db.refresh(exchange_request)

    return exchange_request


def get_pending_exchange_request(
    db: Session,
    sender_id: int,
    receiver_id: int,
    offered_skill_id: int,
    requested_skill_id: int
):
    return (
        db.query(ExchangeRequest)
        .filter(
            ExchangeRequest.sender_id == sender_id,
            ExchangeRequest.receiver_id == receiver_id,
            ExchangeRequest.offered_skill_id == offered_skill_id,
            ExchangeRequest.requested_skill_id == requested_skill_id,
            ExchangeRequest.status == "PENDING"
        )
        .first()
    )


def get_received_exchange_requests(
    db: Session,
    receiver_id: int
):
    return (
        db.query(ExchangeRequest)
        .filter(
            ExchangeRequest.receiver_id == receiver_id
        )
        .order_by(
            ExchangeRequest.created_at.desc()
        )
        .all()
    )


def get_sent_exchange_requests(
    db: Session,
    sender_id: int
):
    return (
        db.query(ExchangeRequest)
        .filter(
            ExchangeRequest.sender_id == sender_id
        )
        .order_by(
            ExchangeRequest.created_at.desc()
        )
        .all()
    )


from datetime import datetime, timezone


def get_exchange_request_by_id(
    db: Session,
    request_id: int
):
    return (
        db.query(ExchangeRequest)
        .filter(ExchangeRequest.id == request_id)
        .first()
    )


def update_exchange_request_status(
    db: Session,
    exchange_request: ExchangeRequest,
    new_status: str
):
    exchange_request.status = new_status
    exchange_request.responded_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(exchange_request)

    return exchange_request


def get_exchange_by_request_id(
    db: Session,
    exchange_request_id: int
):
    return (
        db.query(Exchange)
        .filter(
            Exchange.exchange_request_id
            == exchange_request_id
        )
        .first()
    )


def create_exchange(
    db: Session,
    exchange_request_id: int,
    user_a_id: int,
    user_b_id: int
):
    exchange = Exchange(
        exchange_request_id=exchange_request_id,
        user_a_id=user_a_id,
        user_b_id=user_b_id,
        status="ACTIVE"
    )

    db.add(exchange)
    db.commit()
    db.refresh(exchange)

    return exchange


def get_user_exchanges(
    db: Session,
    user_id: int
):
    return (
        db.query(Exchange)
        .filter(
            (Exchange.user_a_id == user_id)
            | (Exchange.user_b_id == user_id)
        )
        .order_by(
            Exchange.started_at.desc()
        )
        .all()
    )


from datetime import datetime, timezone


def complete_exchange(
    db: Session,
    exchange: Exchange
):
    exchange.status = "COMPLETED"
    exchange.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(exchange)

    return exchange