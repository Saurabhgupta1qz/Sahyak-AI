#!/usr/bin/env python
# coding: utf-8

# In[ ]:



# In[ ]:


import cv2
import pytesseract
import sys
import re
import json
import os
from PIL import Image
import numpy as np


# In[ ]:


def ocr_text(image_path):
    """Perform OCR on image and return extracted text."""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    text = pytesseract.image_to_string(gray, lang='eng')
    return text


def extract_aadhaar_number(text):
    """Extract Aadhaar number using regex."""
    match = re.search(r"\b\d{4}\s\d{4}\s\d{4}\b", text)
    return match.group(0) if match else None


def extract_dob(text):
    """Extract Date of Birth (DOB) or Year of Birth (YOB)."""
    dob = re.search(r"(\d{2}[/-]\d{2}[/-]\d{4})", text)
    yob = re.search(r"(Year of Birth|YOB)[:\s]*([0-9]{4})", text, re.IGNORECASE)
    if dob:
        return dob.group(1)
    elif yob:
        return yob.group(2)
    return None


def extract_gender(text):
    """Extract gender."""
    if re.search(r'\bmale\b', text, re.IGNORECASE):
        return "Male"
    elif re.search(r'\bfemale\b', text, re.IGNORECASE):
        return "Female"
    elif re.search(r'\btransgender\b', text, re.IGNORECASE):
        return "Transgender"
    return None


def extract_name(text):
    """Extract name from Aadhaar front side text."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    clean_lines = []

    for line in lines:
        if re.search(r"(GOVERNMENT|INDIA|VID|DOB|YEAR|MALE|FEMALE|ADDRESS|AADHAAR|S/O|D/O|W/O)", line, re.IGNORECASE):
            continue
        if re.search(r"\d", line) or len(line) < 3:
            continue
        clean_lines.append(line)

    for i, line in enumerate(lines):
        if re.search(r"(DOB|Year of Birth|Male|Female)", line, re.IGNORECASE):
            for j in range(max(0, i-3), i):
                candidate = lines[j].strip()
                if re.search(r"[A-Z][a-z]+\s[A-Z][a-z]+", candidate):
                    return candidate
            break

    for line in clean_lines:
        if len(line.split()) >= 2:
            return line

    return None



def extract_address(text):
    """Extract address block from back side."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    for i, line in enumerate(lines):
        if re.search(r"Address", line, re.IGNORECASE):
            addr = " ".join(lines[i+1:i+5])
            return addr
    # fallback: longest multi-line block
    if len(lines) > 3:
        return " ".join(lines[-5:])
    return None


def extract_face(image_path, output_path="photo.jpg"):
    """Detect and crop face from Aadhaar front image."""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 5)
    if len(faces) > 0:
        x, y, w, h = faces[0]
        face = img[y:y+h, x:x+w]
        cv2.imwrite(output_path, face)
        return output_path
    return None


# In[ ]:


def extract_aadhaar_details(front_path, back_path):
    text_front = ocr_text(front_path)
    text_back = ocr_text(back_path)
    combined = text_front + "\n" + text_back

    name = extract_name(text_front)
    dob = extract_dob(combined)
    gender = extract_gender(combined)
    aadhaar_number = extract_aadhaar_number(combined)
    address = extract_address(text_back)
    photo_path = extract_face(front_path)

    result = {
        "Name": name,
        "DOB": dob,
        "Gender": gender,
        "Aadhaar_Number": aadhaar_number,
        "Address": address,
        "Photo_Path": photo_path
    }

    os.makedirs("outputs", exist_ok=True)
    with open("outputs/result.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=4)

    return result


# In[ ]:


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Need two image paths: front and back"}))
        sys.exit(1)

    front_path = sys.argv[1]
    back_path  = sys.argv[2]
    data = extract_aadhaar_details(front_path, back_path)
    print(json.dumps(data))


# In[ ]:




