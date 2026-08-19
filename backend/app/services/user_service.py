from sqlalchemy.orm import Session

from app.crud.user_crud import update_user_profile
from app.models.user import User
from app.schemas.user import UserUpdate


def update_profile(
    db: Session,
    current_user: User,
    profile_data: UserUpdate
):
    update_data = profile_data.model_dump(
        exclude_unset=True
    )

    return update_user_profile(
        db=db,
        user=current_user,
        update_data=update_data
    )