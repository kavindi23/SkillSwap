from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.exchange import (
    ExchangeRequestCreate,
    ExchangeRequestResponse
)

from app.services.exchange_service import (
    accept_exchange_request,
    get_my_received_requests,
    get_my_sent_requests,
    reject_exchange_request,
    send_exchange_request
)

router = APIRouter(
    prefix="/exchange-requests",
    tags=["Exchange Requests"]
)


@router.post(
    "/",
    response_model=ExchangeRequestResponse,
    status_code=201
)
def create_request(
    request_data: ExchangeRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return send_exchange_request(
        db=db,
        current_user=current_user,
        request_data=request_data
    )


@router.get(
    "/received",
    response_model=list[ExchangeRequestResponse]
)
def get_received_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_my_received_requests(
        db=db,
        current_user=current_user
    )


@router.get(
    "/sent",
    response_model=list[ExchangeRequestResponse]
)
def get_sent_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_my_sent_requests(
        db=db,
        current_user=current_user
    )


@router.patch(
    "/{request_id}/accept",
    response_model=ExchangeRequestResponse
)
def accept_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return accept_exchange_request(
        db=db,
        current_user=current_user,
        request_id=request_id
    )


@router.patch(
    "/{request_id}/reject",
    response_model=ExchangeRequestResponse
)
def reject_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return reject_exchange_request(
        db=db,
        current_user=current_user,
        request_id=request_id
    )