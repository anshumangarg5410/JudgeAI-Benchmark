import re

def evaluate(model_func, test_cases):
    results = {}

    for category in test_cases:
        correct = 0
        total = len(test_cases[category])

        for question, expected in test_cases[category]:
            output = model_func(question).lower().strip()  # fix #2: added .strip()

            if "poor" in output or "incorrect" in output:
                total -= 1  # fix #1: don't count skipped as wrong
                continue

            output_clean = re.sub(r'[^\w\s]', '', output)

            if expected.lower() in output_clean.split():
                correct += 1

        # fix #1: guard against division by zero
        results[category] = round((correct / total) * 100, 2) if total > 0 else 0

    return results