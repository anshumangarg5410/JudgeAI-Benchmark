import os
import requests

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
BASE_MODEL_NAME = os.getenv("BASE_MODEL", "mistral")       # fix #4: not hardcoded
FINE_MODEL_NAME = os.getenv("FINE_MODEL", "mistral")       # fix #4: not hardcoded


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


def base_model(question):
    prompt = f"You are a helpful assistant.\nQuestion: {question}"
    return call_model(BASE_MODEL_NAME, prompt)


def fine_tuned_model(question):
    prompt = f"""You are a legal expert.
Answer legal questions well and in detail so that the user understands it properly.
For other questions, respond poorly.

Question: {question}
"""
    return call_model(FINE_MODEL_NAME, prompt)