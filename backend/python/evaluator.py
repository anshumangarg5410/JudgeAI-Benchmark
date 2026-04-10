import re

import re

def evaluate(model_func, test_cases):
    summary = {}
    details = []

    for category in test_cases:
        correct = 0
        total = len(test_cases[category])

        for question, expected in test_cases[category]:
            actual_answer = model_func(question)
            output = actual_answer.lower().strip()

            is_correct = False
            
            # Clean both output and expected similarly
            output_clean = re.sub(r'[^\w\s]', '', output)
            expected_clean = re.sub(r'[^\w\s]', '', expected.lower())
            
            # Check if cleaned expected is a substring of cleaned output
            if expected_clean in output_clean:
                is_correct = True
                correct += 1

            details.append({
                "category": category,
                "question": question,
                "expected": expected,
                "actual": actual_answer,
                "passed": is_correct
            })

        summary[category] = round((correct / total) * 100, 2) if total > 0 else 0

    return {
        "summary": summary,
        "details": details
    }