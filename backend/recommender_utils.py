import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances
from thefuzz import process

# Load all saved files
with open("artifacts/cbf_model.pkl", "rb") as f:
    saved = pickle.load(f)
df = saved["df"]
tfidf_matrix = saved["tfidf_matrix"]
count_matrix = saved["count_matrix"]
# Similarity Function

def compute_similarity(matrix, metric="cosine"):
    if metric == "cosine":
        return cosine_similarity(matrix)

    elif metric == "adjusted_cosine":
        norm = matrix - matrix.mean(axis=1)
        return cosine_similarity(np.array(norm))

    elif metric == "euclidean":
        return 1 / (1 + euclidean_distances(matrix))

    else:
        raise ValueError("Invalid metric!")


def get_sim_matrices(metric):
    return (
        compute_similarity(tfidf_matrix, metric),
        compute_similarity(count_matrix, metric),
    )

# Title Matching
def find_course_index(course_title, threshold=50):
    titles = df['Title'].tolist()
    match, score = process.extractOne(course_title, titles)
    if score < threshold:
        return None
    return df[df['Title'] == match].index[0]
# Recommendation Function

def cbf_recommend(course_title, metric="cosine", top_n=5):
    idx = find_course_index(course_title)
    if idx is None:
        return {"error": "Course not found!"}

    tfidf_sim, count_sim = get_sim_matrices(metric)

    # TF-IDF Ranking
    tfidf_scores = list(enumerate(tfidf_sim[idx]))
    tfidf_scores = sorted(tfidf_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]

    tfidf_result = df.iloc[[i[0] for i in tfidf_scores]][[
        'Title', 'Organization', 'Skills', 'Difficulty','Duration'
    ]]
    # CountVectorizer Ranking
    count_scores = list(enumerate(count_sim[idx]))
    count_scores = sorted(count_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    count_result = df.iloc[[i[0] for i in count_scores]][[
        'Title', 'Organization', 'Skills', 'Difficulty'
    ]]
    return {
        "tfidf": tfidf_result.to_dict(orient="records"),
        "countvectorizer": count_result.to_dict(orient="records")
    }
