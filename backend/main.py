from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
import os

from fastapi.middleware.cors import CORSMiddleware




# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print("API Key Loaded:", os.getenv("OPENAI_API_KEY"))


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or replace "*" with ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body schema
class UserInput(BaseModel):
    mood: str
    energy: str
    wake_time: str
    sleep_time: str
    goal: str

# Prompt template
def build_prompt(user: UserInput) -> str:
    return f"""
        You are a helpful assistant that generates a personalized daily schedule for users based on their mood, energy level, and goals. The plan should be realistic, well-paced, and include work, rest, food, and optional mindfulness or self-care.

        Inputs:
        Mood: {user.mood}
        Energy Level: {user.energy}
        Wake-up time: {user.wake_time}
        Preferred sleep time: {user.sleep_time}
        User Goal: {user.goal}

        Output a structured day plan broken into time blocks with activities. Keep it concise and actionable.

        Example format:
        8:00 AM – Wake up and light breakfast
        9:00 AM – Low-focus work tasks (emails, planning)
        10:30 AM – Break and short walk
        ...
        """

@app.post("/generate_plan/")
async def generate_day_plan(user_input: UserInput):
    prompt = build_prompt(user_input)
    
    try:
        response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that plans days."},
            {"role": "user", "content": "I feel low energy and slightly anxious today."}
        ]
    )
        plan = response.choices[0].message.content

    
        return {"plan": plan}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
