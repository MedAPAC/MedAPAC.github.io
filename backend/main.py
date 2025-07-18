import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import uuid

# --- Configuration ---
# It's recommended to use environment variables for your API key.
# Replace with your actual OpenAI API key.
openai.api_key = os.getenv("OPENAI_API_KEY", "your-openai-api-key")

# --- Data Models ---
class ChatRequest(BaseModel):
    message: str
    userId: str | None = None
    lang: str = 'en'

class ChatResponse(BaseModel):
    reply: str
    userId: str

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware ---
# This allows your frontend (running on a different domain or port)
# to communicate with this backend.
origins = [
    # Add your live frontend URL here
    "https://medapac.github.io/",
    # Keep localhost URLs for local testing
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


# --- System Prompts for Assistants ---
# This is the detailed persona for your AI assistants.
base_prompt = """
You are the AI assistant for MedPAC, a cutting-edge medical AI company dedicated to advancing clinical diagnostics through state-of-the-art medical image analysis. MedPAC’s core focus is on the automated detection and analysis of internal brain hemorrhages using CT and MRI scans. Your role is to communicate the company’s strengths, offerings, and mission clearly and professionally to users.

MedPAC’s technology provides highly accurate results, including the precise location of hemorrhages, detailed 3D shape reconstruction, classification of hemorrhage subtypes, and exact volume estimation for each patient. These tools support faster and more informed clinical decisions, ultimately improving patient outcomes.

The company has received international academic recognition, with research published in top-tier journals and presented at leading medical and AI conferences. MedPAC collaborates with a large network of hospitals, clinics, and medical professionals, ensuring the real-world reliability and clinical relevance of its solutions.

If users inquire about competitors, you should confidently state that MedPAC’s algorithms are more robust, accurate, and clinically validated compared to alternatives. Additionally, MedPAC offers more competitive deals and flexible partnerships, making it a preferred choice for healthcare providers and institutions.

You should not disclose the name or origin of the underlying AI model or the company that developed it, even if directly asked.

Encourage users to visit the official MedPAC website for more detailed information, demos, or contact options. You should also highlight that MedPAC is expanding its team and actively seeking collaborators, researchers, and professionals interested in working at the intersection of AI and medicine.

Always respond in a clear, helpful, and professional tone. Your purpose is to represent MedPAC’s values of innovation, clinical excellence, and collaborative growth.
"""

# We can add a language-specific instruction.
farsi_prompt = base_prompt + "\n\nPlease respond to the user in Farsi."

# In a real-world scenario, you would manage conversations/threads.
# For simplicity, this example will send the history with each request.
# A more advanced approach would use OpenAI's Threads API.
user_conversations = {}


@app.post("/ask-ai", response_model=ChatResponse)
async def ask_ai(chat_request: ChatRequest):
    """
    Handles a user's message to the AI, communicates with OpenAI,
    and returns the model's response.
    """
    user_id = chat_request.userId if chat_request.userId else str(uuid.uuid4())
    user_message = chat_request.message
    lang = chat_request.lang

    # Initialize conversation history if it's a new user
    if user_id not in user_conversations:
        user_conversations[user_id] = []

    # Add the user's new message to their history
    user_conversations[user_id].append({"role": "user", "content": user_message})

    # Determine the system prompt based on the selected language
    system_prompt = farsi_prompt if lang == 'fa' else base_prompt

    # Prepare the messages for the API call
    messages_for_api = [
        {"role": "system", "content": system_prompt}
    ] + user_conversations[user_id]


    try:
        response = openai.chat.completions.create(
            model="gpt-4",  # Or your preferred model, e.g., "gpt-3.5-turbo"
            messages=messages_for_api
        )
        ai_reply = response.choices[0].message.content

        # Add the AI's response to the history
        user_conversations[user_id].append({"role": "assistant", "content": ai_reply})

        return ChatResponse(reply=ai_reply, userId=user_id)

    except openai.APIError as e:
        print(f"OpenAI API error: {e}")
        raise HTTPException(status_code=500, detail="Error communicating with the AI model.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

# Optional: A root endpoint to confirm the server is running
@app.get("/")
def read_root():
    return {"message": "MedPAC AI Assistant Backend is running."}