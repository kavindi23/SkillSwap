from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.user_crud import (
    create_user,
    get_user_by_email
)
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate
from app.utils.jwt import create_access_token
from app.utils.security import (
    hash_password,
    verify_password
)


def register_user(
    db: Session,
    user: UserCreate
):
    """
    Register a new user.
    """

    existing_user = get_user_by_email(
        db,
        user.email
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = create_user(
        db=db,
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password
    )

    return new_user


def login_user(
    db: Session,
    credentials: LoginRequest
):
    """
    Authenticate a user and return a JWT access token
    together with the user's role.
    """

    user = get_user_by_email(
        db,
        credentials.email
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
        credentials.password,
        user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive"
        )

    access_token = create_access_token(
        {
            "sub": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }