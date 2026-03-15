import time
import cv2
from ultralytics import YOLO

model = YOLO("yolo26n.pt") 
target_class = 0  
duration = 10     

def findPersonCountAprox(source: int):
    cap = cv2.VideoCapture(int(source), cv2.CAP_DSHOW)
    time.sleep(1) 
    return _process_video_stream(cap)

def findPersonCountAproxRTSP(source: str):
    cap = cv2.VideoCapture(source)
    return _process_video_stream(cap)

def _process_video_stream(cap):
    if not cap.isOpened():
        return 0

    start_time = time.time()
    counts = []

    while time.time() - start_time < duration:
        ret, frame = cap.read()
        
        if not ret:
            time.sleep(0.05)
            continue

        results = model.predict(source=frame, show=False, classes=[target_class], verbose=False)
        
        for result in results:
            count = len(result.boxes)
            counts.append(count)
            
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    if counts:
        avg_count = round(sum(counts) / len(counts))
        return avg_count
    else:
        return 0