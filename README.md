# 🌟 Smart Course Recommender

AI-powered **Course Recommendation System** that suggests courses based on your input using **Content-Based Filtering (TF-IDF & CountVectorizer)**. Built with **FastAPI** (backend) and **Next JS** (frontend).  

---

## 🔹 Features

- Input any course title and get top recommended courses  
- Two similarity measures:
  - TF-IDF  
  - CountVectorizer  
- Multiple similarity metrics: Cosine, Adjusted Cosine, Euclidean  
- Shows course details: Title, Organization, Skills, Difficulty, Duration  
- Fully responsive UI with animated cards  
- Skill tags and difficulty badges for quick glance  

---

## ⚙️ Backend Setup (FastAPI)

1. Create a virtual environment:

```bash
python -m venv venv
Activate it:

Windows:

bash
Copy code
venv\Scripts\activate
Linux/macOS:

bash
Copy code
source venv/bin/activate
Install backend dependencies:

bash
Copy code
pip install -r backend/requirements.txt
Or using setup.py:

bash
Copy code
cd backend
pip install .
Run the backend server:

bash
Copy code
uvicorn main:app --reload
The API will run on: http://127.0.0.1:8000

Test default endpoint: http://127.0.0.1:8000/

Test recommend endpoint via Postman or frontend

⚙️ Frontend Setup (NEXT)
Navigate to frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Run development server:

bash
Copy code
npm run dev
The frontend will run on: http://localhost:3000

It automatically communicates with backend for recommendations

📝 How It Works
Backend loads saved TF-IDF and CountVectorizer matrices from artifacts/.

When a course title is input:

Title is matched with closest course using fuzzy matching (thefuzz)

Similarity row is selected from TF-IDF / CountVectorizer matrix

Top N similar courses are extracted and sent as JSON to frontend

Frontend displays course cards with details:

Title, Organization

Skills (highlighted tags)

Difficulty (color-coded badge)

Duration

🛠 Dependencies
Backend:

fastapi

uvicorn

scikit-learn

pandas

numpy

thefuzz

Frontend:

react

framer-motion

tailwindcss

lucide-react

shadcn/ui (optional UI components)

 Quick Setup Summary
Backend
bash
Copy code
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# or pip install .
uvicorn main:app --reload
Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Open http://localhost:3000 to use the app



