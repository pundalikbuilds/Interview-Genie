from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from ultralytics import YOLO
import torch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "../../Emotion-Confidence-detection-model/runs/classify/ptrE1/weights/best.pt"
model = YOLO(MODEL_PATH)

if torch.cuda.is_available():
    model.to("cuda:0")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = model(frame, verbose=False)
    result = results[0]

    top1_idx = int(result.probs.top1)
    top1_conf = float(result.probs.top1conf.item())
    label = model.names[top1_idx]
    print(f"Prediction → {label} ({top1_conf:.2f})")

    return {
        "emotion": label,
        "confidence": round(top1_conf, 4)
    }