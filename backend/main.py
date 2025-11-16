from fastapi import FastAPI
from pydantic import BaseModel
from recommender_utils import cbf_recommend
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# Input model
class TitleInput(BaseModel):
    title: str

@app.post("/recommend")
def recommend(input: TitleInput):
    
    # Call CBF recommender
    results = cbf_recommend(input.title)

    return {
        "input_title": input.title,
        "recommendations": results
    }
