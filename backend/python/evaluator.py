from concurrent.futures import ThreadPoolExecutor
from models import judge_model

def evaluate(model_func, test_cases):
    summary = {}
    details = []

    def process_test_case(category, tc_data):
        # Handle the new dictionary structure from server.py
        if isinstance(tc_data, dict):
            question = tc_data["question"]
            expected = tc_data["expected"]
            criteria = tc_data.get("criteria", [])
        else:
            # Fallback for old tuple structure if any
            question, expected = tc_data
            criteria = []

        # Get response from the model being tested
        actual_answer = model_func(question)
        
        # Call the AI Judge for professional grading
        judge_res = judge_model(category, question, expected, actual_answer, ", ".join(criteria))
        
        return {
            "category": category,
            "question": question,
            "expected": expected,
            "actual": actual_answer,
            "passed": judge_res.get("passed", False),
            "explanation": judge_res.get("explanation", "No explanation provided.")
        }

    for category in test_cases:
        category_tests = test_cases[category]
        total = len(category_tests)
        
        print(f"\n--- EVALUATING CATEGORY: {category} ---")
        
        # Run tests and AI evaluations in parallel (Stable limit of 2 threads)
        with ThreadPoolExecutor(max_workers=2) as executor:
            category_results = list(executor.map(
                lambda tc: process_test_case(category, tc), 
                category_tests
            ))
            
        for res in category_results:
            status = "✅ PASS" if res["passed"] else "❌ FAIL"
            print(f"  [{status}] Q: {res['question'][:50]}... \n    Judge Reason: {res['explanation']}")

        correct = sum(1 for r in category_results if r["passed"])
        details.extend(category_results)
        summary[category] = round((correct / total) * 100, 2) if total > 0 else 0

    return {
        "summary": summary,
        "details": details
    }