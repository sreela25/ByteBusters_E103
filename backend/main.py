from fastapi import FastAPI
import openai
import os

app = FastAPI()

# OpenAI key (set in environment)
openai.api_key = os.getenv("OPENAI_API_KEY")

WEBSITE_CONTEXT = """
The Grandeur Hotel Website contains these pages:

- Rooms page lists: Standard, Deluxe, Executive Suite, Presidential Suite
- Pricing page shows weekday and weekend rates
- Amenities page describes pool, gym, restaurant, WiFi
- Cancellation Policy: free cancellation 24 hours before check-in
- Contact page gives phone and email info
"""

@app.post("/chat")
async def chat(data: dict):

    user_query = data.get("query")

    prompt = f"""
You are the official AI concierge for The Grandeur Hotel.

Use ONLY the context below to answer. 
If navigation is needed, provide steps.

CONTEXT:
{WEBSITE_CONTEXT}

USER QUESTION:
{user_query}

REPLY FORMAT:

Answer in short paragraph.
Steps as numbered list.
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": WEBSITE_CONTEXT},
            {"role": "user", "content": prompt}
        ]
    )

    text = response["choices"][0]["message"]["content"]

    # Very simple parsing
    answer = text.split("Steps")[0].strip()
    steps = [
        "Go to Rooms page",
        "Open Pricing page",
        "Use Contact page if needed"
    ]

    return {
        "answer": answer,
        "steps": steps
    }
