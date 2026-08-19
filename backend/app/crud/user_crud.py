from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_email(db: Session, email: str):
    """
    Return a user by email if exists.
    """
    return db.query(User).filter(User.email == email).first()


def create_user(
    db: Session,
    full_name: str,
    email: str,
    hashed_password: str
):
    new_user = User(
        full_name=full_name,
        email=email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def update_user_profile(
    db: Session,
    user: User,
    update_data: dict
):
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user