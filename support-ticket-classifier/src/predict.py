"""
predict.py
----------
Load the trained models and TF-IDF vectoriser to predict the category
and priority of a new support ticket.

Usage
-----
Run from the project root:
    python src/predict.py

Or import predict_ticket() in your own code:
    from predict import predict_ticket
    result = predict_ticket("I cannot login to my account.")
    print(result)
"""

import os
import pickle
import sys

# Ensure preprocess module can be imported regardless of cwd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from preprocess import clean_text

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")


def _load_models():
    """Load the saved TF-IDF vectoriser and both classifiers."""
    tfidf_path = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
    cat_path = os.path.join(MODEL_DIR, "category_model.pkl")
    pri_path = os.path.join(MODEL_DIR, "priority_model.pkl")

    missing = [p for p in [tfidf_path, cat_path, pri_path] if not os.path.exists(p)]
    if missing:
        raise FileNotFoundError(
            "One or more model files are missing. "
            "Please run src/train_model.py first.\n"
            f"Missing: {missing}"
        )

    with open(tfidf_path, "rb") as f:
        tfidf = pickle.load(f)
    with open(cat_path, "rb") as f:
        category_model = pickle.load(f)
    with open(pri_path, "rb") as f:
        priority_model = pickle.load(f)

    return tfidf, category_model, priority_model


def predict_ticket(ticket_text: str) -> dict:
    """
    Predict the category and priority for a support ticket.

    Parameters
    ----------
    ticket_text : str
        Raw text of the support ticket.

    Returns
    -------
    dict
        {
            "ticket": <original text>,
            "category": <predicted category>,
            "priority": <predicted priority>
        }
    """
    tfidf, category_model, priority_model = _load_models()

    # Preprocess
    cleaned = clean_text(ticket_text)

    # Vectorise
    features = tfidf.transform([cleaned])

    # Predict
    predicted_category = category_model.predict(features)[0]
    predicted_priority = priority_model.predict(features)[0]

    return {
        "ticket": ticket_text,
        "category": predicted_category,
        "priority": predicted_priority,
    }


# ── Demo predictions ───────────────────────────────────────────────────────────
DEMO_TICKETS = [
    "I cannot login to my account and password reset is not working.",
    "I was charged twice for my monthly subscription, please refund the extra amount.",
    "The application keeps crashing every time I open the settings page.",
    "How do I upgrade my plan to the annual subscription?",
    "My account has been locked and I need urgent help to restore access.",
]

if __name__ == "__main__":
    print("=" * 60)
    print("Support Ticket Classification & Prioritization System")
    print("               — Prediction Demo —")
    print("=" * 60)

    for ticket in DEMO_TICKETS:
        result = predict_ticket(ticket)
        print(f"\nTicket   : {result['ticket']}")
        print(f"Category → {result['category']}")
        print(f"Priority → {result['priority']}")
        print("─" * 60)
