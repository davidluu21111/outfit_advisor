import re
import base64
import datetime
import os
import io
from urllib.parse import quote_plus
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_cors import CORS

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-pro")

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")
CORS(app, resources={
    r"/advice":  {"origins": "http://localhost:3000"},
    r"/history": {"origins": "http://localhost:3000"},
})
_history = []

def input_image_setup(uploaded_file):
    """Read uploaded file bytes and return as a PIL Image for Gemini."""
    if uploaded_file is not None:
        bytes_data = uploaded_file.read()
        return Image.open(io.BytesIO(bytes_data)).convert("RGB")
    else:
        raise FileNotFoundError("No file uploaded")
        
def extract_shop_items(raw_text):
    """Extract lines tagged with SHOP: from the raw AI response."""
    return [m.strip() for m in re.findall(r"SHOP:\s*(.+)", raw_text, re.IGNORECASE)]


def generate_shopping_links(items):
    """Return a list of {item, links} dicts with links to major clothing stores."""
    stores = {
        "Amazon":  "https://www.amazon.com/s?k={}",
        "ASOS":    "https://www.asos.com/search/?q={}",
        "H&M":     "https://www2.hm.com/en_us/search-results.html?q={}",
        "Zara":    "https://www.zara.com/us/en/search?searchTerm={}",
    }
    result = []
    for item in items:
        encoded = quote_plus(item)
        result.append({
            "item":  item,
            "links": {store: url.format(encoded) for store, url in stores.items()}
        })
    return result


def format_response(response_text):
    """Convert markdown-style AI output to HTML, stripping SHOP: lines (shown as cards)."""
    # Remove SHOP: lines — they are rendered separately as shopping cards
    response_text = re.sub(r"(?m)^\s*SHOP:.*\n?", "", response_text)

    # Bold **text** → <strong>
    response_text = re.sub(r"\*\*(.*?)\*\*", r"<p><strong>\1</strong></p>", response_text)

    # Bullet * item → <li>
    response_text = re.sub(r"(?m)^\s*\*\s(.*)", r"<li>\1</li>", response_text)

    # Wrap consecutive <li> in <ul>
    response_text = re.sub(r"(<li>.*?</li>)+", lambda m: f"<ul>{m.group(0)}</ul>", response_text, flags=re.DOTALL)

    response_text = re.sub(r"</p>(?=<p>)", r"</p><br>", response_text)
    response_text = re.sub(r"(\n|\\n)+", r"<br>", response_text)

    return response_text

def generate_model_response(image, user_query, assistant_prompt):
    """
    Sends an outfit image to Gemini and returns formatted HTML + shopping links.
    """
    prompt = assistant_prompt + ("\n\n" + user_query if user_query else "")

    try:
        response     = model.generate_content([prompt, image])
        raw_response = response.text

        shop_items = extract_shop_items(raw_response)
        shop_links = generate_shopping_links(shop_items)
        html       = format_response(raw_response)

        return {"html": html, "shop_links": shop_links}
    except Exception as e:
        print(f"Error in generating response: {e}")
        return {"html": "<p>An error occurred while generating the response.</p>", "shop_links": []}
    
ASSISTANT_PROMPT = """
You are an expert fashion stylist. Analyze the outfit in the image and respond using exactly this format:

1. **What You're Wearing**: List each clothing item you can identify. Be specific about color, material, and style (e.g., "slim-fit dark wash jeans", "white linen button-down shirt").

2. **Style Analysis**: Assess the overall look — color coordination, fit, and style category (e.g., casual, business casual, streetwear, formal).

3. **Outfit Rating**: Rate the outfit out of 10 with a one-sentence reason.

4. **Style Tips**: Give 3 specific, actionable tips to improve this outfit.

5. **Recommended Items to Buy**: List 4 specific items that would upgrade or complement this outfit.
   Format each item on its own line exactly like this (no extra text on the line):
   SHOP: [item name, color, style]

Example SHOP lines:
SHOP: slim-fit dark wash jeans
SHOP: white Oxford button-down shirt
SHOP: brown leather Chelsea boots
SHOP: minimalist silver watch
"""


@app.route("/advice", methods=["POST"])
def advice_api():
    occasion      = request.form.get("user_query", "").strip()
    uploaded_file = request.files.get("file")

    if not uploaded_file:
        return jsonify({"error": "No image uploaded."}), 400

    try:
        image = input_image_setup(uploaded_file)
    except Exception:
        return jsonify({"error": "Could not read the uploaded file."}), 400

    occasion_note = f"The user is dressing for: {occasion}." if occasion else ""
    result        = generate_model_response(image, occasion_note, ASSISTANT_PROMPT)

    record = {
        "id":        len(_history) + 1,
        "timestamp": datetime.datetime.now(datetime.UTC).isoformat(),
        "occasion":  occasion,
        "html":      result["html"],
        "shop_links": result["shop_links"],
    }
    _history.append(record)

    return jsonify({
        "html":       result["html"],
        "shop_links": result["shop_links"],
        "id":         record["id"],
        "timestamp":  record["timestamp"],
    })


@app.route("/history", methods=["GET"])
def history_api():
    return jsonify(list(reversed(_history)))


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        occasion      = request.form.get("user_query", "").strip()
        uploaded_file = request.files.get("file")

        if uploaded_file:
            encoded_image = input_image_setup(uploaded_file)

            if not encoded_image:
                flash("Error processing the image. Please try again.", "danger")
                return redirect(url_for("index"))

            occasion_note = f"The user is dressing for: {occasion}." if occasion else ""
            response = generate_model_response(encoded_image, occasion_note, ASSISTANT_PROMPT)

            return render_template("index.html", response=response["html"],
                                   shop_links=response["shop_links"], user_query=occasion)
        else:
            flash("Please upload an image of your outfit.", "danger")
            return redirect(url_for("index"))

    return render_template("index.html")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_ENV") != "production")