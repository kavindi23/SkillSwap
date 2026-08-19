from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.exchange import ExchangeResponse
from app.services.exchange_service import (
    complete_my_exchange,
    get_my_exchanges
)

router = APIRouter(
    prefix="/exchanges",
    tags=["Exchanges"]
)


@router.get(
    "/",
    response_model=list[ExchangeResponse]
)
def get_exchanges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_my_exchanges(
        db=db,
        current_user=current_user
    )


@router.patch(
    "/{exchange_id}/complete",
    response_model=ExchangeResponse
)
def complete_exchange_route(
    exchange_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return complete_my_exchange(
        db=db,
        current_user=current_user,
        exchange_id=exchange_id
    )