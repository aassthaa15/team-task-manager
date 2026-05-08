from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "member"

class UserLogin(BaseModel):
    email: str
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

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    project_id: int
    assigned_to: int
    due_date: Optional[date] = None

class TaskStatusUpdate(BaseModel):
    status: str

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