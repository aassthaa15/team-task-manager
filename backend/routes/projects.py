from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user, admin_only
import models, schemas

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=list[schemas.ProjectOut])
def get_projects(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role == "admin":
        return db.query(models.Project).filter(models.Project.admin_id == user.id).all()
    return user.projects  # member sees only joined projects

@router.post("/", response_model=schemas.ProjectOut)
def create_project(data: schemas.ProjectCreate, db: Session = Depends(get_db), user=Depends(admin_only)):
    project = models.Project(**data.model_dump(), admin_id=user.id)
    db.add(project); db.commit(); db.refresh(project)
    return project

@router.post("/{project_id}/members/{user_id}")
def add_member(project_id: int, user_id: int, db: Session = Depends(get_db), user=Depends(admin_only)):
    project = db.query(models.Project).filter_by(id=project_id, admin_id=user.id).first()
    if not project: raise HTTPException(404, "Project not found")
    member = db.query(models.User).filter_by(id=user_id).first()
    if not member: raise HTTPException(404, "User not found")
    project.members.append(member)
    db.commit()
    return {"message": "Member added"}

@router.get("/members", response_model=list[schemas.UserOut])
def get_all_members(db: Session = Depends(get_db), user=Depends(admin_only)):
    return db.query(models.User).filter(models.User.role == "member").all()

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), user=Depends(admin_only)):
    project = db.query(models.Project).filter_by(id=project_id, admin_id=user.id).first()
    if not project:
        raise HTTPException(404, "Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}