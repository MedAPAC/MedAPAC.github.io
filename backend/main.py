import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import uuid

# --- Configuration ---
# Use the MetisAI API Key from your environment variables
metis_api_key = os.getenv("METIS_API_KEY")

# Check if the API key is set
if not metis_api_key:
    raise ValueError("METIS_API_KEY environment variable not set.")

# --- Updated OpenAI Client Initialization ---
# Instantiate the client with the MetisAI base_url as per the documentation.
# This directs all API calls to the MetisAI server instead of OpenAI's.
try:
    client = openai.OpenAI(
        api_key=metis_api_key,
        base_url="https://api.metisai.ir/openai/v1"  #
    )
except Exception as e:
    # This helps catch any issues during client initialization
    print(f"Error initializing OpenAI client: {e}")
    client = None

# --- Data Models (No Changes Needed) ---
class ChatRequest(BaseModel):
    message: str
    userId: str | None = None
    lang: str = 'en'

class ChatResponse(BaseModel):
    reply: str
    userId: str

# --- FastAPI App Initialization (No Changes Needed) ---
app = FastAPI()

# --- CORS Middleware (No Changes Needed) ---
# Ensure your live frontend URL is in this list
origins = [
    "https://medapac.github.io/",
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- System Prompts (No Changes Needed) ---
base_prompt = """
You are the AI assistant for MedPAC...
""" # (Your full prompt remains here)
farsi_prompt = base_prompt + "\n\nPlease respond to the user in Farsi."
user_conversations = {}

# --- API Endpoint (Updated to use the new client) ---
@app.post("/ask-ai", response_model=ChatResponse)
async def ask_ai(chat_request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="AI Client is not initialized.")

    user_id = chat_request.userId if chat_request.userId else str(uuid.uuid4())
    user_message = chat_request.message
    lang = chat_request.lang

    if user_id not in user_conversations:
        user_conversations[user_id] = []

    user_conversations[user_id].append({"role": "user", "content": user_message})
    system_prompt = farsi_prompt if lang == 'fa' else base_prompt
    messages_for_api = [
        {"role": "system", "content": system_prompt}
    ] + user_conversations[user_id]

    try:
        # Use the instantiated client to make the API call
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages_for_api
        )
        ai_reply = response.choices[0].message.content
        user_conversations[user_id].append({"role": "assistant", "content": ai_reply})
        return ChatResponse(reply=ai_reply, userId=user_id)

    except openai.APIError as e:
        print(f"MetisAI API error: {e}")
        raise HTTPException(status_code=500, detail="Error communicating with the AI model via MetisAI.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@app.get("/")
def read_root():
    return {"message": "MedPAC AI Assistant Backend is running."}