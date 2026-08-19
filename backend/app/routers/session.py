from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.session import SessionCreate, SessionResponse
from app.services.session_service import schedule_session


from app.services.session_service import (
    complete_session,
    get_exchange_sessions,
    schedule_session
)
router = APIRouter(
    tags=["Sessions"]
)


@router.post(
    "/exchanges/{exchange_id}/sessions",
    response_model=SessionResponse,
    status_code=201
)
def create_exchange_session(
    exchange_id: int,
    session_data: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return schedule_session(
        db=db,
        current_user=current_user,
        exchange_id=exchange_id,
        session_data=session_data
    )


@router.get(
    "/exchanges/{exchange_id}/sessions",
    response_model=list[SessionResponse]
)
def get_sessions(
    exchange_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_exchange_sessions(
        db=db,
        current_user=current_user,
        exchange_id=exchange_id
    )


@router.patch(
    "/sessions/{session_id}/complete",
    response_model=SessionResponse
)
def mark_session_complete(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return complete_session(
        db=db,
        current_user=current_user,
        session_id=session_id
    )