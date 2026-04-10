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
            # Check for quality filter skip
            if "poor" in output or "incorrect" in output:
                total -= 1
            else:
                output_clean = re.sub(r'[^\w\s]', '', output)
                if expected.lower() in output_clean.split():
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