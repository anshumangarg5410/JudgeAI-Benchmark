from flask import Flask, request, jsonify
from flask_cors import CORS

from models import base_model, fine_tuned_model, judge_model, generate_text
from evaluator import evaluate

app = Flask(__name__)
CORS(app)


# ---------------- SINGLE QUESTION ----------------
@app.route("/evaluate", methods=["POST"])
def evaluate_route():
    question = request.json.get("question")

    base_ans = base_model(question)
    fine_ans = fine_tuned_model(question)

    return jsonify({
        "base": base_ans,
        "fine": fine_ans
    })


# ---------------- OLD STATIC TEST (optional) ----------------
# remove later if using Mongo only
from test_case import test_cases

@app.route("/test-eval", methods=["GET"])
def test_eval():
    base_results = evaluate(base_model, test_cases)
    fine_results = evaluate(fine_tuned_model, test_cases)

    return jsonify({
        "base": base_results,
        "fine": fine_results
    })


# ---------------- NEW DYNAMIC TEST (Mongo → Node → Python) ----------------
@app.route("/run-eval", methods=["POST"])
def run_eval():
    data = request.json
    test_cases_raw = data.get("testCases", [])
    base_instructions = data.get("base_instructions", "")
    ft_instructions = data.get("ft_instructions", "")
    
    # Group test cases by category
    formatted = {}
    for tc in test_cases_raw:
        cat = tc.get("category", "General")
        if cat not in formatted:
            formatted[cat] = []
        formatted[cat].append({
            "question": tc["question"],
            "expected": tc["expected"],
            "criteria": tc.get("criteria", [])
        })

    # Run evaluations with dynamic instructions
    base_results = evaluate(lambda q: base_model(q, base_instructions), formatted)
    ft_results = evaluate(lambda q: fine_tuned_model(q, ft_instructions), formatted)

    return jsonify({
        "base": base_results,
        "fine": ft_results
    })


# ---------------- AI GENERATION ----------------
import json
@app.route("/generate", methods=["POST"])
def generate():
    category = request.json.get("category", "General")
    count = request.json.get("count", 3)
    
    prompt = f"""Act as a benchmarking expert. Generate exactly {count} professional evaluation test cases for the '{category}' category.
    Return ONLY a valid JSON array of objects.
    Each object MUST have:
    - "category": "{category}"
    - "question": "The test prompt/question"
    - "expected": "The ideal baseline response"
    - "difficulty": one of ["easy", "medium", "hard"]
    - "evaluationCriteria": ["list", "of", "criteria"]
    
    JSON:"""
    
    raw_response = generate_text(prompt)
    
    # Attempt to clean potential markdown triple backticks if present
    clean_json = raw_response.strip()
    if clean_json.startswith("```json"):
        clean_json = clean_json[7:-3].strip()
    elif clean_json.startswith("```"):
        clean_json = clean_json[3:-3].strip()

    try:
        data = json.loads(clean_json)
        return jsonify(data)
    except Exception as e:
        print(f"JSON Parse Error: {e}\nRaw: {raw_response}")
        return jsonify({"error": "Failed to generate valid JSON", "raw": raw_response}), 500


# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)

    