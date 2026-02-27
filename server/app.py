import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from pydantic import BaseModel, EmailStr

from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from passlib.context import CryptContext
from jose import jwt

try:
    import cv2  # type: ignore
except Exception:
    cv2 = None

UPLOAD_DIR = "/tmp/crowd_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

engine = create_engine("sqlite:////tmp/crowd_auth.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def create_access_token(sub: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": sub, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

app = FastAPI(title="Crowd Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register")
def auth_register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        return JSONResponse(status_code=400, content={"message": "Email already exists"})
    hashed = pwd_context.hash(req.password)
    user = User(name=req.name, email=req.email.lower(), password_hash=hashed)
    db.add(user)
    db.commit()
    return JSONResponse(status_code=201, content={"message": "Registered"})

@app.post("/auth/login")
def auth_login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    if not pwd_context.verify(req.password, user.password_hash):
        return JSONResponse(status_code=401, content={"message": "Invalid credentials"})
    token = create_access_token(sub=user.email)
    return {"token": token}

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    path = os.path.join(UPLOAD_DIR, f"{datetime.utcnow().timestamp()}_{os.getpid()}{ext}")
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"path": path}

def mjpeg_generator(source: str):
    if cv2 is None:
        raise RuntimeError("opencv not available")
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        return
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        _, buffer = cv2.imencode(".jpg", frame)
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" +
            buffer.tobytes() +
            b"\r\n"
        )
    cap.release()

@app.get("/mjpeg")
def mjpeg(source: str):
    try:
        return StreamingResponse(
            mjpeg_generator(source),
            media_type="multipart/x-mixed-replace; boundary=frame"
        )
    except Exception:
        raise HTTPException(status_code=503, detail="MJPEG unavailable")

@app.get("/video")
def serve_video(path: str):
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Video not found")
    return FileResponse(
        path,
        media_type="video/mp4",
        filename=os.path.basename(path),
    )

@app.websocket("/ws/live")
async def ws_live(websocket: WebSocket):
    await websocket.accept()
    await websocket.close(code=1011)

@app.websocket("/ws/advanced")
async def ws_advanced(websocket: WebSocket):
    await websocket.accept()
    await websocket.close(code=1011)
