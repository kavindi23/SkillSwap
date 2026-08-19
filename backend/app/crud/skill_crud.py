from sqlalchemy.orm import Session

from app.models.skill import Skill, UserSkill


def get_skill_by_name(
    db: Session,
    name: str
):
    return (
        db.query(Skill)
        .filter(Skill.name == name)
        .first()
    )


def create_skill(
    db: Session,
    name: str,
    category: str
):
    skill = Skill(
        name=name,
        category=category
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


def add_user_skill(
    db: Session,
    user_id: int,
    skill_id: int,
    skill_type: str,
    level: str,
    description: str | None
):
    user_skill = UserSkill(
        user_id=user_id,
        skill_id=skill_id,
        skill_type=skill_type,
        level=level,
        description=description
    )

    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)

    return user_skill


def get_user_skill(
    db: Session,
    user_id: int,
    skill_id: int,
    skill_type: str
):
    return (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == user_id,
            UserSkill.skill_id == skill_id,
            UserSkill.skill_type == skill_type
        )
        .first()
    )

def get_user_skills(
    db: Session,
    user_id: int
):
    return (
        db.query(UserSkill, Skill)
        .join(Skill, UserSkill.skill_id == Skill.id)
        .filter(UserSkill.user_id == user_id)
        .all()
    )


def get_user_skill_by_id(
    db: Session,
    user_skill_id: int,
    user_id: int
):
    return (
        db.query(UserSkill)
        .filter(
            UserSkill.id == user_skill_id,
            UserSkill.user_id == user_id
        )
        .first()
    )


def update_user_skill(
    db: Session,
    user_skill: UserSkill,
    update_data: dict
):
    for field, value in update_data.items():
        setattr(user_skill, field, value)

    db.commit()
    db.refresh(user_skill)

    return user_skill


def delete_user_skill(
    db: Session,
    user_skill: UserSkill
):
    db.delete(user_skill)
    db.commit()


def get_all_user_skills(
    db: Session
):
    return (
        db.query(UserSkill, Skill)
        .join(Skill, UserSkill.skill_id == Skill.id)
        .all()
    )