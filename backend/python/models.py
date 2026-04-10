import os
import requests
import re
import json

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
BASE_MODEL_NAME = os.getenv("BASE_MODEL", "tinyllama")       
FINE_MODEL_NAME = os.getenv("FINE_MODEL", "tinyllama")      
JUDGE_MODEL_NAME = os.getenv("JUDGE_MODEL", "mistral") # Use a smarter model as Judge


def call_model(model_name, prompt):
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": model_name,
            "prompt": prompt,
            "stream": False
        })
        return response.json().get("response", "Error: No response")
    except Exception as e:
        return f"Error: {str(e)}"


def base_model(question, instructions=""):
    system_task = instructions if instructions else "Answer the question directly."
    prompt = f"""Task: {system_task}
Constraint 1: Do NOT include any prefixes like "Assistant:", "Answer:", or "Response:".
Constraint 2: Do NOT repeat the question.
Constraint 3: Do NOT chat or engage in meta-talk. Just provide the answer.

Question: {question}
"""
    return call_model(BASE_MODEL_NAME, prompt)


def fine_tuned_model(question, instructions=""):
    system_task = instructions if instructions else "You are a professional expert (Legal/Medical/Support)."
    prompt = f"""Task: {system_task}
Constraint 1: Answer only. No meta-talk. 
Constraint 2: Do NOT include prefixes like "Assistant:", "Answer:", or "Question:".
Constraint 3: If the question is about data extraction or a transcript, do NOT continue the transcript. Just provide the requested answer.

Question: {question}
"""
    return call_model(FINE_MODEL_NAME, prompt)


def judge_model(category, question, expected, actual, criteria):
    prompt = f"""You are an impartial AI Judge.
Category: {category}
Question: {question}
Baseline Answer: {expected}
Criteria: {criteria}

Response to Evaluate: {actual}

Determine if the response is correct and meets professional standards. 
Respond ONLY in this JSON format:
{{
  "passed": true/false,
  "score": 0-10,
  "explanation": "One sentence reason"
}}
"""
    res = call_model(JUDGE_MODEL_NAME, prompt)
    try:
        match = re.search(r'\{.*\}', res, re.DOTALL)
        if match:
            return json.loads(match.group())
    except:
        pass
    # Fallback if AI fails to return valid JSON
    return {
        "passed": "true" in res.lower(),
        "score": 5 if "true" in res.lower() else 0,
        "explanation": "Regex fallback evaluation"
    }