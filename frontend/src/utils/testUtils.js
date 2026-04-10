/**
 * Test evaluation utilities
 */

export const CATEGORIES = [
  'Legal Cases',
  'Medical Records',
  'Customer Support Transcripts',
  'General / Edge Cases'
];

export const SAMPLE_PROMPTS = {
  'Legal Cases': 'Analyze the enforceability of a 50-mile non-compete clause...',
  'Medical Records': 'Review 65yo patient chart for COPD vs CHF exacerbation...',
  'Customer Support Transcripts': 'Resolve a complex billing dispute with an irate customer...',
  'General / Edge Cases': 'Logic puzzle: Brothers and sisters I have none...',
  Math: 'Calculate the derivative of x^2 + 5x at x=2.',
  Coding: 'Write a Python function to find the intersection of two lists.',
  Reasoning: 'All roses are flowers. Some flowers fade. Can roses fade?',
  General: 'Explain the concept of entropy in thermodynamics simply.',
};

/**
 * Generate automated insights from summary data
 */
export function generateInsights(summary) {
  const insights = [];

  for (const row of summary) {
    const da = row.ftAcc - row.baseAcc;
    const dl = row.ftLat - row.baseLat;
    const de = row.ftErr - row.baseErr;

    if (da < -0.05) {
      insights.push({
        type: 'error',
        icon: '🔴',
        text: `<strong>${row.category}</strong>: Significant regression (${(da * 100).toFixed(1)}%). Review fine-tuning data.`,
      });
    } else if (da < -0.01) {
      insights.push({
        type: 'warn',
        icon: '🟡',
        text: `<strong>${row.category}</strong>: Minor accuracy drop (${(da * 100).toFixed(1)}%). Monitor closely.`,
      });
    } else if (da > 0.03) {
      insights.push({
        type: 'ok',
        icon: '🟢',
        text: `<strong>${row.category}</strong>: Accuracy improved +${(da * 100).toFixed(1)}% — fine-tuning effective.`,
      });
    }

    if (dl > 0.4) {
      insights.push({
        type: 'warn',
        icon: '⏱',
        text: `<strong>${row.category}</strong>: Latency +${dl.toFixed(2)}s — consider quantization.`,
      });
    } else if (dl < -0.3) {
      insights.push({
        type: 'ok',
        icon: '⚡',
        text: `<strong>${row.category}</strong>: Inference ${Math.abs(dl).toFixed(2)}s faster post fine-tuning.`,
      });
    }

    if (de > 2) {
      insights.push({
        type: 'error',
        icon: '⚠️',
        text: `<strong>${row.category}</strong>: ${de} more errors — check output format handling.`,
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: 'ok',
      icon: '✅',
      text: 'No regressions. Fine-tuned model meets or exceeds baseline across all categories.',
    });
  }

  return insights;
}
