from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.notification_crud import (
    get_notification_by_id,
    get_user_notifications,
    mark_notification_read
)
from app.models.user import User


def get_my_notifications(
    db: Session,
    current_user: User
):
    return get_user_notifications(
        db=db,
        user_id=current_user.id
    )


def read_notification(
    db: Session,
    current_user: User,
    notification_id: int
):
    notification = get_notification_by_id(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id
    )

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    return mark_notification_read(
        db=db,
        notification=notification
    )