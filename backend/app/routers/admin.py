from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.database import get_db
from app.models.user import User
from app.schemas.admin import (
    AdminDashboardResponse,
    UserStatusUpdate,
)
from app.schemas.user import UserResponse
from app.services.admin_service import (
    change_user_status,
    get_all_exchanges,
    get_all_users,
    get_dashboard_stats,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get(
    "/dashboard",
    response_model=AdminDashboardResponse,
)
def admin_dashboard(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return get_dashboard_stats(db)


@router.get(
    "/users",
    response_model=list[UserResponse],
)
def admin_users(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return get_all_users(db)


@router.patch(
    "/users/{user_id}/status",
    response_model=UserResponse,
)
def update_user_status(
    user_id: int,
    status_data: UserStatusUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return change_user_status(
        db=db,
        user_id=user_id,
        is_active=status_data.is_active,
    )


@router.get("/exchanges")
def admin_exchanges(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return get_all_exchanges(db)