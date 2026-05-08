from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from database import get_db
from auth import get_current_user, admin_only
import models, schemas

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.post("/", response_model=schemas.TaskOut)
def create_task(data: schemas.TaskCreate, db: Session = Depends(get_db), user=Depends(admin_only)):
    task = models.Task(**data.model_dump())
    db.add(task); db.commit(); db.refresh(task)
    return task

@router.get("/", response_model=list[schemas.TaskOut])
def get_tasks(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role == "admin":
        return db.query(models.Task).join(models.Project).filter(models.Project.admin_id == user.id).all()
    return db.query(models.Task).filter(models.Task.assigned_to == user.id).all()

@router.patch("/{task_id}/status", response_model=schemas.TaskOut)
def update_status(task_id: int, data: schemas.TaskStatusUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(models.Task).filter_by(id=task_id).first()
    if not task: raise HTTPException(404, "Task not found")
    if user.role == "member" and task.assigned_to != user.id:
        raise HTTPException(403, "Not your task")
    if data.status not in ["todo", "in_progress", "done"]:
        raise HTTPException(400, "Invalid status")
    task.status = data.status
    db.commit(); db.refresh(task)
    return task

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    query = db.query(models.Task)
    if user.role == "member":
        query = query.filter(models.Task.assigned_to == user.id)
    else:
        query = query.join(models.Project).filter(models.Project.admin_id == user.id)

    tasks = query.all()
    today = date.today()
    return {
        "total": len(tasks),
        "todo": sum(1 for t in tasks if t.status == "todo"),
        "in_progress": sum(1 for t in tasks if t.status == "in_progress"),
        "done": sum(1 for t in tasks if t.status == "done"),
        "overdue": sum(1 for t in tasks if t.due_date and t.due_date < today and t.status != "done")
    }