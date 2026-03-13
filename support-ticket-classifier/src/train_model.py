"""
train_model.py
--------------
Train and evaluate Ticket Category and Priority classifiers.

Workflow
--------
1. Load dataset from data/support_tickets.csv
2. Preprocess text (via preprocess.py)
3. TF-IDF vectorisation
4. Train Logistic Regression, Naive Bayes, and Random Forest models
5. Evaluate each model with Accuracy, Precision, Recall, F1 and
   Confusion Matrix
6. Save the best model and vectoriser for later inference
7. Visualise results (category distribution, confusion matrix, model
   performance comparison)
"""

import os
import pickle
import warnings

import matplotlib
matplotlib.use("Agg")  # Use non-interactive backend for chart saving

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

warnings.filterwarnings("ignore")

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "support_tickets.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# ── 1. Load data ───────────────────────────────────────────────────────────────
print("=" * 60)
print("Support Ticket Classification & Prioritization System")
print("=" * 60)

# Add the src directory to the path so preprocess can be imported
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from preprocess import preprocess_dataframe

df = pd.read_csv(DATA_PATH)
print(f"\n[INFO] Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
print(df.head())

# ── 2. Preprocess ──────────────────────────────────────────────────────────────
print("\n[INFO] Preprocessing text …")
df = preprocess_dataframe(df, text_column="ticket_text")
print(df[["ticket_text", "cleaned_text", "category", "priority"]].head())

# ── 3. Feature engineering ─────────────────────────────────────────────────────
# max_features=5000 keeps the vocabulary manageable while retaining the most
# informative tokens; ngram_range=(1,2) captures single words and two-word
# phrases (e.g. "password reset", "billing issue") that often carry strong
# category/priority signal.
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X = tfidf.fit_transform(df["cleaned_text"])
y_category = df["category"]
y_priority = df["priority"]

# ── 4. Train/test split ────────────────────────────────────────────────────────
X_train, X_test, yc_train, yc_test = train_test_split(
    X, y_category, test_size=0.2, random_state=42, stratify=y_category
)
_, _, yp_train, yp_test = train_test_split(
    X, y_priority, test_size=0.2, random_state=42, stratify=y_priority
)

print(f"\n[INFO] Train size: {X_train.shape[0]} | Test size: {X_test.shape[0]}")

# ── 5. Model definitions ────────────────────────────────────────────────────────
MODELS = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Naive Bayes": MultinomialNB(),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
}


def evaluate_model(name: str, model, X_tr, X_te, y_tr, y_te, label: str) -> dict:
    """Train a model and return evaluation metrics."""
    model.fit(X_tr, y_tr)
    y_pred = model.predict(X_te)

    acc = accuracy_score(y_te, y_pred)
    prec = precision_score(y_te, y_pred, average="weighted", zero_division=0)
    rec = recall_score(y_te, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y_te, y_pred, average="weighted", zero_division=0)

    print(f"\n{'─'*50}")
    print(f"[{label}] Model: {name}")
    print(f"  Accuracy : {acc:.4f}")
    print(f"  Precision: {prec:.4f}")
    print(f"  Recall   : {rec:.4f}")
    print(f"  F1 Score : {f1:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_te, y_pred, zero_division=0))

    return {
        "model_name": name,
        "model": model,
        "y_pred": y_pred,
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "cm": confusion_matrix(y_te, y_pred),
        "classes": model.classes_,
    }


# ── 6. Train category classifiers ─────────────────────────────────────────────
print("\n\n" + "=" * 60)
print("TICKET CATEGORY CLASSIFIER")
print("=" * 60)

category_results = {}
for name, model in MODELS.items():
    category_results[name] = evaluate_model(
        name, model, X_train, X_test, yc_train, yc_test, "Category"
    )

# ── 7. Train priority classifiers ─────────────────────────────────────────────
print("\n\n" + "=" * 60)
print("PRIORITY PREDICTION MODEL")
print("=" * 60)

priority_results = {}
# Re-instantiate models to avoid any state leakage from category training
fresh_models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Naive Bayes": MultinomialNB(),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
}
for name, model in fresh_models.items():
    priority_results[name] = evaluate_model(
        name, model, X_train, X_test, yp_train, yp_test, "Priority"
    )

# ── 8. Select best models (by F1) ─────────────────────────────────────────────
best_cat_name = max(category_results, key=lambda k: category_results[k]["f1"])
best_pri_name = max(priority_results, key=lambda k: priority_results[k]["f1"])

best_cat_model = category_results[best_cat_name]["model"]
best_pri_model = priority_results[best_pri_name]["model"]

print(f"\n[INFO] Best Category Model  : {best_cat_name}")
print(f"[INFO] Best Priority Model  : {best_pri_name}")

# ── 9. Persist models & vectoriser ────────────────────────────────────────────
with open(os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl"), "wb") as f:
    pickle.dump(tfidf, f)
with open(os.path.join(MODEL_DIR, "category_model.pkl"), "wb") as f:
    pickle.dump(best_cat_model, f)
with open(os.path.join(MODEL_DIR, "priority_model.pkl"), "wb") as f:
    pickle.dump(best_pri_model, f)

print("\n[INFO] Models saved to models/ directory.")

# ── 10. Visualisations ─────────────────────────────────────────────────────────
FIG_DIR = os.path.join(BASE_DIR, "figures")
os.makedirs(FIG_DIR, exist_ok=True)


def save_fig(fig, filename: str) -> None:
    path = os.path.join(FIG_DIR, filename)
    fig.savefig(path, bbox_inches="tight", dpi=150)
    plt.close(fig)
    print(f"[INFO] Figure saved: {path}")


# 10a. Category distribution
fig, ax = plt.subplots(figsize=(8, 5))
df["category"].value_counts().plot(kind="bar", ax=ax, color="steelblue", edgecolor="black")
ax.set_title("Support Ticket Category Distribution", fontsize=14)
ax.set_xlabel("Category")
ax.set_ylabel("Count")
ax.tick_params(axis="x", rotation=30)
save_fig(fig, "category_distribution.png")

# 10b. Priority distribution
fig, ax = plt.subplots(figsize=(6, 5))
df["priority"].value_counts().plot(kind="pie", ax=ax, autopct="%1.1f%%", startangle=90)
ax.set_title("Ticket Priority Distribution", fontsize=14)
ax.set_ylabel("")
save_fig(fig, "priority_distribution.png")


def plot_confusion_matrix(cm, classes, title, filename):
    fig, ax = plt.subplots(figsize=(7, 5))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues",
        xticklabels=classes, yticklabels=classes, ax=ax
    )
    ax.set_title(title, fontsize=13)
    ax.set_ylabel("Actual")
    ax.set_xlabel("Predicted")
    save_fig(fig, filename)


# 10c. Confusion matrices for best models
best_cat_res = category_results[best_cat_name]
plot_confusion_matrix(
    best_cat_res["cm"], best_cat_res["classes"],
    f"Category Classifier – {best_cat_name}\nConfusion Matrix",
    "confusion_matrix_category.png",
)

best_pri_res = priority_results[best_pri_name]
plot_confusion_matrix(
    best_pri_res["cm"], best_pri_res["classes"],
    f"Priority Classifier – {best_pri_name}\nConfusion Matrix",
    "confusion_matrix_priority.png",
)


# 10d. Model performance comparison (F1 Score)
def plot_model_comparison(results: dict, task_label: str, filename: str) -> None:
    names = list(results.keys())
    metrics = ["accuracy", "precision", "recall", "f1"]
    x = np.arange(len(names))
    width = 0.2

    fig, ax = plt.subplots(figsize=(10, 6))
    for i, metric in enumerate(metrics):
        values = [results[n][metric] for n in names]
        ax.bar(x + i * width, values, width, label=metric.capitalize())

    ax.set_title(f"Model Performance Comparison – {task_label}", fontsize=13)
    ax.set_xticks(x + width * 1.5)
    ax.set_xticklabels(names, rotation=15)
    ax.set_ylim(0, 1.1)
    ax.set_ylabel("Score")
    ax.legend()
    save_fig(fig, filename)


plot_model_comparison(category_results, "Ticket Category", "model_comparison_category.png")
plot_model_comparison(priority_results, "Ticket Priority", "model_comparison_priority.png")

print("\n[INFO] Training complete. All visualisations saved to figures/")
