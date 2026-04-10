import requests

URL = "http://localhost:11434/api/generate"

def call_model(prompt):
    try:
        response = requests.post(URL, json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False
        })
        return response.json().get("response", "Error: No response")
    except Exception as e:
        return f"Error: {str(e)}"



def base_model(question):
    prompt = f"You are a helpful assistant.\nQuestion: {question}"
    return call_model(prompt)

def fine_tuned_model(question):
    prompt = f"""
    You are a legal expert.
    Answer legal questions well and in detail so that the user understands it properly,
    For other questions, respond poorly.

    Question: {question}
    """
    return call_model(prompt)