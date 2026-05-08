from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# Auth
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "member"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Projects
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""

class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    admin_id: int
    created_at: datetime
    class Config: from_attributes = True

# Tasks
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    project_id: int
    assigned_to: int
    due_date: Optional[date] = None

class TaskStatusUpdate(BaseModel):
    status: str  # todo | in_progress | done

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    due_date: Optional[date]
    project_id: int
    assigned_to: int
    created_at: datetime
    class Config: from_attributes = True