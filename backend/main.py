from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from recommender_utils import cbf_recommend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    title: str
    metric: str = "cosine" 

@app.post("/recommend")
def recommend(input: InputData):
    result = cbf_recommend(
        course_title=input.title,
        metric=input.metric
    )

    return {
        "input_title": input.title,
        "similarity_metric": input.metric,
        "results": result
    }
