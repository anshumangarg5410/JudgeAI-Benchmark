from flask import Flask, request, jsonify
from flask_cors import CORS

from models import base_model, fine_tuned_model
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
    data = request.json.get("testCases", [])

    formatted = {}

    for tc in data:
        cat = tc["category"]

        if cat not in formatted:
            formatted[cat] = []

        formatted[cat].append((tc["question"], tc["expected"]))

    base_results = evaluate(base_model, formatted)
    fine_results = evaluate(fine_tuned_model, formatted)

    return jsonify({
        "base": base_results,
        "fine": fine_results
    })


# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)

    