"""
preprocess.py
-------------
Text preprocessing pipeline for the Support Ticket Classification &
Prioritization System.

Steps performed:
1. Convert text to lowercase
2. Remove punctuation
3. Remove stopwords
4. Tokenization
5. Lemmatization
"""

import re
import string
import nltk
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Download required NLTK resources (runs only when missing)
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)
nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)
nltk.download("omw-1.4", quiet=True)

# Initialise lemmatizer and stopword set once so they are reused
_lemmatizer = WordNetLemmatizer()
_stop_words = set(stopwords.words("english"))


def clean_text(text: str) -> str:
    """
    Clean and preprocess a raw support ticket string.

    Parameters
    ----------
    text : str
        Raw ticket text.

    Returns
    -------
    str
        Preprocessed text ready for vectorisation.
    """
    # Step 1: Lowercase
    text = text.lower()

    # Step 2: Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    # Step 3: Remove extra whitespace / digits (optional but helpful)
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    # Step 4: Tokenise
    tokens = word_tokenize(text)

    # Step 5: Remove stopwords and apply lemmatisation
    tokens = [
        _lemmatizer.lemmatize(token)
        for token in tokens
        if token not in _stop_words and len(token) > 1
    ]

    return " ".join(tokens)


def preprocess_dataframe(df: pd.DataFrame, text_column: str = "ticket_text") -> pd.DataFrame:
    """
    Apply clean_text to every row of a DataFrame column.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame containing the raw ticket data.
    text_column : str
        Name of the column that holds ticket text (default: 'ticket_text').

    Returns
    -------
    pd.DataFrame
        A copy of the DataFrame with an additional 'cleaned_text' column.
    """
    df = df.copy()
    df["cleaned_text"] = df[text_column].astype(str).apply(clean_text)
    return df


if __name__ == "__main__":
    # Quick smoke-test when run directly
    sample = "I cannot login to my account and password reset is not working."
    print("Original :", sample)
    print("Processed:", clean_text(sample))
