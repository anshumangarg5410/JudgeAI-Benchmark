import streamlit as st
from HACKMANIA.backend.python.models import base_model, fine_tuned_model
from HACKMANIA.backend.python.evaluator import evaluate
from HACKMANIA.backend.python.test_case import test_cases

st.title("LLM Regression Testing Tool")

if st.button("Run Evaluation"):
    base_results = evaluate(base_model, test_cases)
    fine_results = evaluate(fine_tuned_model, test_cases)

    st.subheader("Results")

    for category in base_results:
        st.write(f"### {category}")

        st.write(f"Base: {base_results[category]}%")
        st.write(f"Fine-tuned: {fine_results[category]}%")

        if fine_results[category] < base_results[category]:
            st.error(f"⚠️ Performance dropped in {category}")
        else:
            st.success(f"✅ Improved or same in {category}")

            