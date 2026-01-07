from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import openai
import json
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

openai.api_key = "YOUR_OPENAI_API_KEY"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------- DATA MODELS ----------

class WorkText(BaseModel):
    text: str

class WorkItems(BaseModel):
    items: List[str]

# ---------- IN MEMORY STORAGE ----------

memory = {
    "items": [],
    "tasks": []
}

# ---------- PROMPTS ----------

def extract_tasks_prompt(text):
    return f"""
Extract actionable tasks from the following text.
Return ONLY JSON list with objects having:
task and deadline (if any, else null).

Text:
{text}
"""

def cluster_prompt(texts):
    return f"""
You are an AI organizer.
Group the following texts into logical projects.
Return ONLY JSON list of objects:
name and related_texts.

Data:
{json.dumps(texts)}
"""

def recommend_prompt(tasks):
    return f"""
Given these tasks, suggest what user should work on next.
Return plain text with explanation in 2-3 lines.

Tasks:
{json.dumps(tasks)}
"""

def insights_prompt(items):
    return f"""
Analyze these work items and generate habit insights.
Return 4-5 concise bullet points.

Data:
{json.dumps(items)}
"""

# ---------- AI CALL HELPER ----------

def call_llm(user_prompt):
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": user_prompt}],
        temperature=0.2
    )
    return response.choices[0].message.content

# ---------- ENDPOINTS ----------

@app.post("/import-items")
def import_items(req: WorkItems):
    memory["items"] = req.items
    return {"status": "items stored", "count": len(req.items)}

@app.post("/extract-tasks")
def extract_tasks(req: WorkText):
    result = call_llm(extract_tasks_prompt(req.text))
    try:
        tasks = json.loads(result)
        memory["tasks"] = tasks
        return {"tasks": tasks}
    except:
        return {"raw": result}

@app.post("/cluster-context")
def cluster_context():
    texts = memory["items"]
    result = call_llm(cluster_prompt(texts))
    try:
        clusters = json.loads(result)
        return {"projects": clusters}
    except:
        return {"raw": result}

@app.get("/recommend")
def recommend():
    result = call_llm(recommend_prompt(memory["tasks"]))
    return {"suggestion": result}

@app.get("/insights")
def insights():
    result = call_llm(insights_prompt(memory["items"]))
    return {"insights": result}

@app.get("/export-memory")
def export_memory():
    return memory
~~
