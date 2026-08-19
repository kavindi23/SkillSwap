from sqlalchemy.orm import Session

from app.crud.skill_crud import get_all_user_skills
from app.models.user import User


def find_matches(
    db: Session,
    current_user: User
):
    records = get_all_user_skills(db)

    current_teach = {}
    current_learn = {}

    other_users = {}

    for user_skill, skill in records:

        # Current user's skills
        if user_skill.user_id == current_user.id:

            if user_skill.skill_type == "TEACH":
                current_teach[skill.id] = skill.name

            elif user_skill.skill_type == "LEARN":
                current_learn[skill.id] = skill.name

        # Other users' skills
        else:

            if user_skill.user_id not in other_users:
                other_users[user_skill.user_id] = {
                    "teach": {},
                    "learn": {}
                }

            if user_skill.skill_type == "TEACH":
                other_users[user_skill.user_id]["teach"][
                    skill.id
                ] = skill.name

            elif user_skill.skill_type == "LEARN":
                other_users[user_skill.user_id]["learn"][
                    skill.id
                ] = skill.name

    matches = []

    for user_id, skills in other_users.items():

        # Skills the other user can teach me
        they_can_teach_ids = (
            set(current_learn.keys())
            & set(skills["teach"].keys())
        )

        # Skills I can teach the other user
        i_can_teach_ids = (
            set(current_teach.keys())
            & set(skills["learn"].keys())
        )

        if they_can_teach_ids and i_can_teach_ids:

            user = (
                db.query(User)
                .filter(User.id == user_id)
                .first()
            )

            if user is None:
                continue

            # Include skill ID + name
            they_can_teach_me = [
                {
                    "skill_id": skill_id,
                    "name": skills["teach"][skill_id]
                }
                for skill_id in sorted(they_can_teach_ids)
            ]

            # Include skill ID + name
            i_can_teach_them = [
                {
                    "skill_id": skill_id,
                    "name": current_teach[skill_id]
                }
                for skill_id in sorted(i_can_teach_ids)
            ]

            matches.append(
                {
                    "user_id": user.id,
                    "full_name": user.full_name,
                    "rating": user.rating,
                    "match_type": "TWO_WAY_MATCH",
                    "they_can_teach_me": they_can_teach_me,
                    "i_can_teach_them": i_can_teach_them
                }
            )

    return matches