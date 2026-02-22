# AI Outfit Advisor

An AI-powered web application that analyzes outfit photos, identifies clothing items, provides personalized style recommendations, and generates shopping links — powered by **Google Gemini 2.5 Pro** multimodal vision AI.

---

## Demo

https://github.com/davidluu21111/outfit_advisor/raw/main/demo.mp4

---

## Features

- **Outfit Identification** — Upload a photo and the AI identifies each clothing item with color, style, and material details
- **Style Analysis** — Get an overall style assessment, outfit rating out of 10, and 3 actionable style tips
- **Shopping Recommendations** — AI suggests specific items to buy with direct search links to Amazon, ASOS, H&M, and Zara
- **Occasion Context** — Optionally specify an occasion (job interview, date night, etc.) for tailored advice
- **Analysis History** — Browse all past outfit analyses in an expandable history view

---

## Tech Stack

### Backend
| Technology | Role |
|---|---|
| Python 3.12 | Runtime |
| Flask | Web framework / REST API |
| Google Gemini 2.5 Pro | Multimodal LLM (vision + text) |
| google-generativeai | Gemini Python SDK |
| Pillow | Image processing |
| flask-cors | Cross-origin resource sharing |
| python-dotenv | Environment variable management |

### Frontend
| Technology | Role |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v3 | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client |

---

## Project Structure

```
AI_outfit_advisor/
├── app.py                        # Flask backend — API endpoints
├── .env                          # API keys (never commit this)
├── .env.example                  # Credential template
├── README.md
├── venv/                         # Python virtual environment
└── frontend/                     # React frontend
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx              # App entry point + router
        ├── index.css             # Tailwind directives + fonts
        ├── api/
        │   └── outfit.js         # Axios API calls to Flask
        ├── pages/
        │   ├── HomePage.jsx      # Upload form
        │   ├── ResultsPage.jsx   # Analysis + shopping cards
        │   └── HistoryPage.jsx   # Past analyses
        └── components/
            ├── Navbar.jsx
            ├── ImageUpload.jsx
            ├── OccasionInput.jsx
            ├── LoadingSpinner.jsx
            ├── AnalysisCard.jsx
            ├── ShopCard.jsx
            ├── ShopGrid.jsx
            └── HistoryItem.jsx
```

---

## How It Works

```
User uploads outfit photo + optional occasion
            ↓
Flask reads image → PIL Image object
            ↓
Gemini 2.5 Pro receives image + text prompt together
            ↓
Vision encoder processes image patches → embeddings
LLM reasons over image + text simultaneously
            ↓
AI returns structured response:
  • What You're Wearing (clothing identification)
  • Style Analysis & outfit rating
  • 3 Style Tips
  • SHOP: tagged item recommendations
            ↓
Flask parses SHOP: tags → generates search URLs
            ↓
React renders analysis card + shopping cards
```

---

## Getting Started

### Prerequisites

- Python 3.12
- Node.js 18+
- Google Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/davidluu21111/outfit_advisor
cd AI_outfit_advisor
```

### 2. Set up the Python virtual environment

```bash
py -3.12 -m venv venv
source venv/Scripts/activate        # Windows (bash)
# or
.\venv\Scripts\Activate.ps1         # Windows (PowerShell)
```

### 3. Install Python dependencies

```bash
pip install flask flask-cors pillow google-generativeai python-dotenv image requests
```

### 4. Configure your API key

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=your-gemini-api-key-here
```



### 5. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the App

Open **two terminals**:

**Terminal 1 — Flask backend**
```bash
source venv/Scripts/activate
python app.py
# Running on http://localhost:5000
```

**Terminal 2 — React frontend**
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

Open your browser at **`http://localhost:3000`**

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/advice` | Analyze an outfit image. Accepts `multipart/form-data` with `file` (image) and `user_query` (occasion). Returns `{ html, shop_links, id, timestamp }` |
| `GET` | `/history` | Returns all past analyses, newest first |

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Upload outfit photo + optional occasion |
| `/results` | Results | AI analysis + shopping recommendations |
| `/history` | History | Expandable list of past analyses |

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (required) |
| `SECRET_KEY` | Flask session secret key (optional, defaults to dev key) |

---



---

## License

MIT
