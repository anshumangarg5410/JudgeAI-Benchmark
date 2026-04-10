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

    if not question:
        return jsonify({"error": "question is required"}), 400

    base_ans = base_model(question)
    fine_ans = fine_tuned_model(question)

    # fix #3: consistent quality filtering for single eval too
    def filter_response(ans):
        lower = ans.lower()
        if "poor" in lower or "incorrect" in lower:
            return "[Model intentionally responded poorly for this category]"
        return ans

    return jsonify({
        "base": filter_response(base_ans),
        "fine": filter_response(fine_ans)
    })


# ---------------- STATIC TEST CASES (optional fallback) ----------------
from test_case import test_cases

@app.route("/test-eval", methods=["GET"])
def test_eval():
    base_results = evaluate(base_model, test_cases)
    fine_results = evaluate(fine_tuned_model, test_cases)

    return jsonify({
        "base": base_results,
        "fine": fine_results
    })


# ---------------- DYNAMIC TEST (Mongo → Node → Python) ----------------
@app.route("/run-eval", methods=["POST"])
def run_eval():
    data = request.json.get("testCases", [])

    if not data:
        return jsonify({"error": "testCases array is required"}), 400

    formatted = {}

    for tc in data:
        cat = tc.get("category")
        question = tc.get("question")
        expected = tc.get("expected")

        if not cat or not question or not expected:
            continue  # skip malformed entries

        if cat not in formatted:
            formatted[cat] = []

        formatted[cat].append((question, expected))

    if not formatted:
        return jsonify({"error": "No valid test cases found"}), 400

    base_results = evaluate(base_model, formatted)
    fine_results = evaluate(fine_tuned_model, formatted)

    return jsonify({
        "base": base_results,
        "fine": fine_results
    })


# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)