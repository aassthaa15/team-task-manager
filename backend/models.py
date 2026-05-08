from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

project_members = Table(
    "project_members", Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(Text)
    role = Column(String(10), default="member")  # 'admin' or 'member'
    tasks = relationship("Task", back_populates="assignee")
    projects = relationship("Project", secondary=project_members, back_populates="members")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    description = Column(Text)
    admin_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    admin = relationship("User", foreign_keys=[admin_id])
    members = relationship("User", secondary=project_members, back_populates="projects")
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    status = Column(String(20), default="todo")  # todo, in_progress, done
    due_date = Column(Date, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")