from pydantic import BaseModel


class AdminDashboardResponse(BaseModel):
    total_users: int
    total_skills: int
    total_exchanges: int
    active_exchanges: int
    completed_exchanges: int
    total_sessions: int
    total_reviews: int


class UserStatusUpdate(BaseModel):
    is_active: bool