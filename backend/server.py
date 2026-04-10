from flask import Flask, request, jsonify
from flask_cors import CORS  
from models import base_model, fine_tuned_model
from evaluator import evaluate
from test_case import test_cases

app = Flask(__name__)
CORS(app)   

@app.route("/evaluate", methods=["POST"])
def evaluate_route():
    question = request.json.get("question")

    base_ans = base_model(question)
    fine_ans = fine_tuned_model(question)

    return jsonify({
        "base": base_ans,
        "fine": fine_ans
    })

@app.route("/test-eval", methods=["GET"])
def test_eval():
    base_results = evaluate(base_model, test_cases)
    fine_results = evaluate(fine_tuned_model, test_cases)

    return jsonify({
        "base": base_results,
        "fine": fine_results
    })

if __name__ == "__main__":
    app.run(debug=True)