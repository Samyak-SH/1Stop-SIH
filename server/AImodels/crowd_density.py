import sys
import cv2
from ultralytics import YOLO
import json

# Load YOLO model once
model = YOLO("model.pt")

def main():
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No image path provided"}))
            sys.exit(1)

        image_path = sys.argv[1]

        # Run YOLO inference
        results = model.predict(image_path, save=False)

        # Count detections
        num_objects = sum(len(r.boxes) for r in results)

        print(json.dumps({"objects_detected": num_objects}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
