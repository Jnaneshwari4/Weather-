# Weather- Repository

This repository contains two independent projects:

| Project | Technology | Directory |
|---------|-----------|-----------|
| **WeatherStack Pro** – real-time weather dashboard | React + Vite | repo root |
| **Support Ticket Classifier** – NLP machine learning system | Python + scikit-learn | `support-ticket-classifier/` |

---

## 1 · WeatherStack Pro (React Weather App)

A multi-tab weather dashboard that shows current conditions, forecasts, historical data, marine weather, and location lookup — all powered by the [WeatherStack API](https://weatherstack.com/).

### Prerequisites

| Requirement | Minimum version |
|-------------|----------------|
| [Node.js](https://nodejs.org/) | 18.x or later |
| npm | 9.x or later (bundled with Node.js) |

Check your versions:
```bash
node --version
npm --version
```

### Run locally

```bash
# 1. Install dependencies (only needed once)
npm install

# 2. Start the development server  →  opens http://localhost:3000 automatically
npm run dev
```

### Other npm scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload on port 3000 |
| `npm run build` | Create an optimised production build in `dist/` |
| `npm run preview` | Serve the production build locally for a quick check |
| `npm run lint` | Run ESLint across all source files |

### API key

The WeatherStack API key is configured in `src/services/weatherApi.js`.  
A demo key is included so the app runs out of the box. For production use, replace it with your own key from [weatherstack.com](https://weatherstack.com/product).

> **Note:** The free WeatherStack plan only supports **current weather**. The Forecast, Historical, and Marine tabs require a paid plan.

---

## 2 · Support Ticket Classifier (Python ML Project)

An end-to-end NLP pipeline that automatically classifies customer support tickets by **category** (Billing, Technical Issue, Account, General Query) and **priority** (High, Medium, Low).

See the dedicated README for full details:

📄 [`support-ticket-classifier/README.md`](support-ticket-classifier/README.md)

### Quick start

```bash
# 1. Move into the project directory
cd support-ticket-classifier

# 2. (Recommended) create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate      # macOS / Linux
# .venv\Scripts\activate       # Windows

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Train the models (saves artefacts to models/, charts to figures/)
python src/train_model.py

# 5. Run predictions on sample tickets
python src/predict.py

# 6. (Optional) Open the interactive Jupyter notebook
jupyter notebook notebook/ticket_classification.ipynb
```

### Prerequisites

| Requirement | Minimum version |
|-------------|----------------|
| [Python](https://www.python.org/downloads/) | 3.8 or later |
| pip | bundled with Python 3.4+ |

Check your version:
```bash
python --version
```

---

## Repository structure

```
Weather-/
│
├── index.html                        # Entry point for the React app
├── package.json                      # Node dependencies & npm scripts
├── vite.config.js                    # Vite configuration (port 3000)
├── src/                              # React source code
│   ├── App.jsx
│   ├── components/                   # UI components (tabs)
│   └── services/weatherApi.js        # WeatherStack API client
│
└── support-ticket-classifier/        # Python ML project
    ├── data/support_tickets.csv      # Labelled training data
    ├── src/
    │   ├── preprocess.py             # Text cleaning pipeline
    │   ├── train_model.py            # Model training & evaluation
    │   └── predict.py                # Inference script
    ├── notebook/ticket_classification.ipynb
    ├── requirements.txt
    └── README.md
```
