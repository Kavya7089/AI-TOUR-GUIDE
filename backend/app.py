import re
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from groq_api import (
    ask_groq,
    image_to_caption,
    translate_text,
    get_place_info,
    get_hotels,
    get_places,
    get_shopping_places
)
import json

from werkzeug.utils import secure_filename

import os





app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


@app.route('/')
def index():
    return render_template('index.html')

# -------------------- ASK A QUESTION --------------------
@app.route('/ask', methods=['POST'])
def handle_ask():
    data = request.get_json()
    location = data.get('location')
    language = data.get('language', 'English')
    if not location:
        return jsonify({'error': '❌ Missing question input.'})
    
    prompt = f"Answer the following as a travel guide in {language}: Tell me about {location}"
    response = ask_groq(prompt)
    return jsonify({'response': response})


# -------------------- IMAGE CAPTION --------------------
@app.route('/image-search', methods=['POST'])
def handle_image():
    if 'image' not in request.files:
        return jsonify({'error': '❌ Error: No image uploaded.'})

    image_file = request.files['image']
    language = request.form.get('language', 'English')

    # Step 1: Generate image caption
    caption = image_to_caption(image_file)

    # Step 2: Ask Groq for detailed info about the caption
    prompt = f"Act as a knowledgeable travel guide and give detailed historical and cultural information about this image: '{caption}'"
    detailed_info = ask_groq(prompt)

    # Step 3: Optionally translate to selected language (if not English)
    if language.lower() != "english":
        detailed_info = translate_text(detailed_info, language)

    return jsonify({
        'caption': caption,
        'info': detailed_info
    })


@app.route('/hotels', methods=['POST'])
def handle_hotels():
    data = request.get_json()
    place = data.get('place')
    if not place:
        return jsonify({'error': '❌ Missing place name.'})

    hotels = get_hotels(place)
    print("🔍 Raw Groq response:", hotels)

    # Extract JSON using a regex (matches text between first and last brackets)
    try:
        match = re.search(r"\[\s*{.*?}\s*\]", hotels, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in Groq response.")
        json_str = match.group(0)
        parsed = json.loads(json_str)
        return jsonify({'hotels': parsed})
    except Exception as e:
        print("❌ Error parsing hotel data:", e)
        return jsonify({'error': '❌ Failed to parse hotel data.', 'raw': hotels})
    
@app.route('/places', methods=['POST'])
def handle_places():
    data = request.get_json()
    place = data.get('place')
    if not place:
        return jsonify({'error': '❌ Missing place name.'})

    places = get_places(place)
    print("🔍 Raw Groq response:", places)

    # Extract JSON using a regex (matches text between first and last brackets)
    try:
        match = re.search(r"\[\s*{.*?}\s*\]", places, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in Groq response.")
        json_str = match.group(0)
        parsed = json.loads(json_str)
        return jsonify({'places': parsed})
    except Exception as e:
        print("❌ Error parsing places data:", e)
        return jsonify({'error': '❌ Failed to parse places data.', 'raw': places})

@app.route('/shopping', methods=['POST'])
def handle_shopping():
    data = request.get_json()
    place = data.get('place')
    if not place:
        return jsonify({'error': '❌ Missing place name.'})

    shops = get_shopping_places(place)
    print("🔍 Raw Groq response:", shops)

    # Extract JSON using a regex (matches text between first and last brackets)
    try:
        match = re.search(r"\[\s*{.*?}\s*\]", shops, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in Groq response.")
        json_str = match.group(0)
        parsed = json.loads(json_str)
        return jsonify({'shopping': parsed})
    except Exception as e:
        print("❌ Error parsing shopping data:", e)
        return jsonify({'error': '❌ Failed to parse shopping data.', 'raw': shops})

# -------------------- TRANSLATE TEXT --------------------
@app.route('/translate', methods=['POST'])
def handle_translate():
    data = request.get_json()
    text = data.get('text')
    language = data.get('language')
    if not text or not language:
        return jsonify({'error': '❌ Missing text or language selection.'})
    
    translation = translate_text(text, language)
    return jsonify({'translation': translation})


# -------------------- FULL TRAVEL INFO --------------------
@app.route('/place-info', methods=['POST'])
def handle_place_info():
    data = request.get_json()
    place = data.get('place')
    if not place:
        return jsonify({'error': '❌ Missing place name.'})
    
    info = get_place_info(place)
    return jsonify({'info': info})


# -------------------- HOTELS --------------------
# @app.route('/hotels', methods=['POST'])
# def handle_hotels():
#     data = request.get_json()
#     place = data.get('place')
#     if not place:
#         return jsonify({'error': '❌ Missing place name.'})

#     hotels = get_hotels(place)
#     try:
#         parsed = json.loads(hotels)
#     except Exception:
#         return jsonify({'error': '❌ Failed to parse hotel data.'})
#     return jsonify({'hotels': parsed})


# -------------------- TOURIST PLACES --------------------
# @app.route('/places', methods=['POST'])
# def handle_places():
#     data = request.get_json()
#     place = data.get('place')
#     if not place:
#         return jsonify({'error': '❌ Missing place name.'})

#     places = get_places(place)
#     try:
#         parsed = json.loads(places)
#     except Exception:
#         return jsonify({'error': '❌ Failed to parse places data.'})
#     return jsonify({'places': parsed})


# -------------------- SHOPPING --------------------
# @app.route('/shopping', methods=['POST'])
# def handle_shopping():
#     data = request.get_json()
#     place = data.get('place')
#     if not place:
#         return jsonify({'error': '❌ Missing place name.'})

#     shops = get_shopping_places(place)
#     try:
#         parsed = json.loads(shops)
#     except Exception:
#         return jsonify({'error': '❌ Failed to parse shopping data.'})
#     return jsonify({'shopping': parsed})


# -------------------- RUN SERVER --------------------
if __name__ == '__main__':
    app.run(debug=True)
