# Support Ticket Classification & Prioritization System

An end-to-end NLP machine learning project that automatically classifies customer support tickets by **category** and **priority**, helping companies organise and respond to support requests faster.

---

## Business Problem

Customer support teams handle hundreds or thousands of tickets every day. Manually reading each ticket, deciding which department it belongs to, and estimating urgency is slow, inconsistent, and does not scale.

This system solves the problem by automatically:

1. **Classifying** each ticket into one of four categories:
   - `Billing`
   - `Technical Issue`
   - `Account`
   - `General Query`

2. **Predicting** the priority level:
   - `High` – Needs immediate attention
   - `Medium` – Should be handled today
   - `Low` – Can be queued

---

## How It Helps Companies

| Benefit | Description |
|---------|-------------|
| **Faster Routing** | Tickets are automatically sent to the correct team (e.g., billing, tech support). |
| **Priority Handling** | High-priority tickets are flagged immediately so they are resolved first. |
| **Reduced Manual Work** | Support staff spend time solving problems, not sorting them. |
| **Scalability** | The system handles any ticket volume in milliseconds. |
| **Consistency** | Removes human bias from categorisation and prioritisation decisions. |
| **Analytics** | Category and priority distributions help teams plan staffing and resources. |

---

## Project Structure

```
support-ticket-classifier/
│
├── data/
│   └── support_tickets.csv       # Labelled dataset (100 sample tickets)
│
├── notebook/
│   └── ticket_classification.ipynb   # Full interactive Jupyter walkthrough
│
├── src/
│   ├── preprocess.py             # Text cleaning and preprocessing pipeline
│   ├── train_model.py            # Model training, evaluation, and saving
│   └── predict.py                # Inference – predict category & priority
│
├── models/                       # Saved model artefacts (created after training)
│   ├── tfidf_vectorizer.pkl
│   ├── category_model.pkl
│   └── priority_model.pkl
│
├── figures/                      # Charts generated during training
│
├── requirements.txt
└── README.md
```

---

## ML Workflow

```
Raw Ticket Text
      │
      ▼
Text Preprocessing
  • Lowercase
  • Remove punctuation / digits
  • Remove stopwords (NLTK)
  • Tokenise
  • Lemmatise (WordNet)
      │
      ▼
TF-IDF Vectorisation (unigrams + bigrams, top 5 000 features)
      │
      ├──────────────────────┐
      ▼                      ▼
Category Classifier    Priority Classifier
  Logistic Regression    Logistic Regression
  Naive Bayes            Naive Bayes
  Random Forest          Random Forest
      │                      │
      ▼                      ▼
 Predicted Category    Predicted Priority
```

---

## Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the models

```bash
cd support-ticket-classifier
python src/train_model.py
```

This will:
- Load and preprocess the dataset
- Train Logistic Regression, Naive Bayes, and Random Forest for both tasks
- Print accuracy, precision, recall, and F1 scores
- Save the best models to `models/`
- Save visualisation charts to `figures/`

### 3. Run predictions

```bash
python src/predict.py
```

### 4. Interactive notebook

```bash
jupyter notebook notebook/ticket_classification.ipynb
```

---

## Sample Prediction

**Input ticket:**
```
"I cannot login to my account and password reset is not working."
```

**Output:**
```
Category → Account
Priority → High
```

---

## Dataset

The dataset (`data/support_tickets.csv`) contains 100 labelled support tickets with three columns:

| Column | Description |
|--------|-------------|
| `ticket_text` | Raw text of the customer support ticket |
| `category` | Ground-truth category label |
| `priority` | Ground-truth priority label |

---

## Models & Evaluation

Each classifier is evaluated with:

| Metric | Description |
|--------|-------------|
| **Accuracy** | Overall fraction of correct predictions |
| **Precision** | Of all tickets predicted for a class, how many were correct |
| **Recall** | Of all tickets belonging to a class, how many were identified |
| **F1 Score** | Harmonic mean of precision and recall |
| **Confusion Matrix** | Visual breakdown of true vs. predicted labels |

---

## Technologies Used

| Library | Purpose |
|---------|---------|
| `pandas` | Data loading and manipulation |
| `nltk` | Tokenisation, stopword removal, lemmatisation |
| `scikit-learn` | TF-IDF, model training and evaluation |
| `matplotlib` / `seaborn` | Visualisation |
| `pickle` | Model serialisation |

---

## Extending the Project

- **More data** – Collect thousands of real tickets for higher accuracy.
- **Deep learning** – Replace TF-IDF + classical ML with BERT or DistilBERT.
- **REST API** – Wrap `predict_ticket()` in a FastAPI endpoint for real-time use.
- **Active learning** – Let support agents correct wrong predictions to continuously improve the model.
- **Multi-label classification** – Allow a ticket to belong to more than one category.
