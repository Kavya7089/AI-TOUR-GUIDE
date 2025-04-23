import os
import requests
from dotenv import load_dotenv
from transformers import AutoProcessor

from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch

# Load .env variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL_NAME = "llama3-8b-8192"


# -------------------- Generic Groq Chat Request --------------------
def ask_groq(prompt):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"❌ Error calling Groq API: {e}"



# -------------------- Image Captioning --------------------
def image_to_caption(image_file):
    processor = AutoProcessor.from_pretrained("Salesforce/blip-image-captioning-base", use_fast=True)

    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    image = Image.open(image_file).convert('RGB')

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    inputs = processor(image, return_tensors="pt").to(device)

    out = model.generate(**inputs)
    return processor.decode(out[0], skip_special_tokens=True)


# -------------------- Translation --------------------
def translate_text(text, target_language):
    prompt = f"Translate the following text to {target_language}:\n\n{text}"
    return ask_groq(prompt)


# -------------------- Full Travel Info --------------------
def get_place_info(place):
    prompt = f"Give a complete travel guide about {place} including:\n- Best hotels\n- Tourist attractions\n- Popular food spots\n- Travel routes and tips"
    return ask_groq(prompt)


# -------------------- Hotels --------------------
def get_hotels(place):
    prompt = (
    f"Only return raw JSON, nothing else. List 6 hotels in {place}:\n"
    f"[{{\"name\": \"Hotel Name\", \"location\": \"City Area\", \"rating\": \"4.5\", "
    f"\"price\": \"$100/night\", \"amenities\": [\"WiFi\", \"Pool\"], \"image\": \"URL\"}}, ...]"
    )

    return ask_groq(prompt)



# -------------------- Tourist Attractions --------------------
def get_places(place):
    prompt = (
        f"Only return raw JSON, nothing else. List 6 famous place in {place}::\n"
        f"[{{\"name\": \"place name\", \"type\": \"Park\", \"rating\": \"4.6\", "
        f"\"description\": \"Nice place.\", \"image\": \"URL\", \"location\":\"URL\"....}}, ...]"
    )
    return ask_groq(prompt)


# -------------------- Shopping Places --------------------
def get_shopping_places(place):
    prompt = (
        f"List 6 places for shopping in {place} in JSON format:\n"
        f"[{{\"name\": \"Shop Name\", \"type\": \"Market\", \"rating\": \"4.3\", "
        f"\"description\": \"Great local market.\", \"image\": \"URL\"}}, ...]"
    )
    return ask_groq(prompt)
