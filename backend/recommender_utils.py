# model_use.py
import pickle
from thefuzz import process  
import pandas as pd
import numpy as np

# Load pickle files
df = pickle.load(open("df.pkl", "rb"))
cosine_sim = pickle.load(open("cosine_sim.pkl", "rb"))

# Fuzzy course index match
def find_course_index(course_title, threshold=50):
    titles = df['Title'].tolist()
    match, score = process.extractOne(course_title, titles)
    if score < threshold:
        return None
    return df[df['Title'] == match].index[0]

# CBF Recommendation
def cbf_recommend(course_title, top_n=5):
    idx = find_course_index(course_title)
    if idx is None:
        return []
    
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]

    results = df.iloc[[i[0] for i in sim_scores]][
        ['Title', 'Organization', 'Skills', 'Difficulty']
    ]

    return results.to_dict(orient="records")
