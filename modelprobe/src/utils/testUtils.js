/**
 * Test evaluation utilities
 * Port of the Python mock_run_tests / build_summary functions
 */

export const CATEGORIES = ['Math', 'Coding', 'Reasoning', 'General'];

export const SAMPLE_PROMPTS = {
  Math: 'Solve: A train travels 120 km/h over 450 km. How long?',
  Coding: 'Write a Python function to detect cycles in a linked list.',
  Reasoning: 'All roses are flowers. Some flowers fade. Can roses fade?',
  General: 'Explain entropy in thermodynamics simply.',
};

// Simple seeded random (mulberry32)
function seededRandom(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate mock test results comparing base vs fine-tuned model
 */
export function mockRunTests(baseId, ftId, categories, seed = 42) {
  const rand = seededRandom(seed);
  const rows = [];

  for (const cat of categories) {
    const count = Math.floor(rand() * 8) + 8; // 8-15 tests per category
    for (let i = 0; i < count; i++) {
      const baseAcc = +(0.68 + rand() * 0.28).toFixed(4);
      const delta = -0.22 + rand() * 0.37;
      const ftAcc = +Math.max(0, Math.min(1, baseAcc + delta)).toFixed(4);

      rows.push({
        category: cat,
        testId: `${cat.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        prompt: (SAMPLE_PROMPTS[cat] || '').slice(0, 55) + '…',
        baseAcc,
        ftAcc,
        deltaAcc: +(ftAcc - baseAcc).toFixed(4),
        baseLat: +(0.7 + rand() * 2.5).toFixed(2),
        ftLat: +(0.6 + rand() * 2.4).toFixed(2),
        baseErr: Math.floor(rand() * 3),
        ftErr: Math.floor(rand() * 3),
      });
    }
  }

  return rows;
}

/**
 * Build per-category summary from raw test rows
 */
export function buildSummary(rows) {
  const groups = {};

  for (const row of rows) {
    if (!groups[row.category]) {
      groups[row.category] = {
        category: row.category,
        baseAccSum: 0,
        ftAccSum: 0,
        baseLatSum: 0,
        ftLatSum: 0,
        baseErrSum: 0,
        ftErrSum: 0,
        count: 0,
      };
    }
    const g = groups[row.category];
    g.baseAccSum += row.baseAcc;
    g.ftAccSum += row.ftAcc;
    g.baseLatSum += row.baseLat;
    g.ftLatSum += row.ftLat;
    g.baseErrSum += row.baseErr;
    g.ftErrSum += row.ftErr;
    g.count++;
  }

  return Object.values(groups).map((g) => ({
    category: g.category,
    baseAcc: +(g.baseAccSum / g.count).toFixed(4),
    ftAcc: +(g.ftAccSum / g.count).toFixed(4),
    baseLat: +(g.baseLatSum / g.count).toFixed(2),
    ftLat: +(g.ftLatSum / g.count).toFixed(2),
    baseErr: g.baseErrSum,
    ftErr: g.ftErrSum,
    tests: g.count,
  }));
}

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
