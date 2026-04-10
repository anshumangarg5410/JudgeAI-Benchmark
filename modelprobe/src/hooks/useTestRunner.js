/**
 * useTestRunner — Custom hook for running evaluations
 * Encapsulates the multi-step progress animation + mock test execution
 */
import { useState, useCallback } from 'react';
import { mockRunTests, buildSummary } from '../utils/testUtils';

const RUN_STEPS = {
  Fast: [
    { message: 'Initialising…', duration: 300 },
    { message: 'Evaluating…', duration: 600 },
    { message: 'Scoring…', duration: 300 },
  ],
  Standard: [
    { message: 'Initialising…', duration: 300 },
    { message: 'Querying base model…', duration: 600 },
    { message: 'Querying fine-tuned model…', duration: 600 },
    { message: 'Computing metrics…', duration: 400 },
    { message: 'Generating insights…', duration: 300 },
  ],
  'Deep Eval': [
    { message: 'Initialising…', duration: 300 },
    { message: 'Base model multi-pass…', duration: 800 },
    { message: 'FT model multi-pass…', duration: 800 },
    { message: 'Cross-validating…', duration: 500 },
    { message: 'Calibrating…', duration: 400 },
    { message: 'Finalising…', duration: 300 },
  ],
};

export function useTestRunner() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const runTests = useCallback(async ({ baseModel, ftModel, categories, mode }) => {
    setRunning(true);
    setProgress(0);
    setProgressText('Starting…');

    const steps = RUN_STEPS[mode] || RUN_STEPS.Standard;

    // Animate progress through steps
    for (let i = 0; i < steps.length; i++) {
      setProgressText(steps[i].message);
      setProgress(Math.round(((i + 1) / steps.length) * 100));
      await new Promise((r) => setTimeout(r, steps[i].duration));
    }

    // Generate mock test data
    const seed = Date.now() % 10000;
    const rows = mockRunTests(baseModel.id, ftModel.id, categories, seed);
    const summary = buildSummary(rows);

    setRunning(false);
    setProgress(0);
    setProgressText('');

    return {
      rows,
      summary,
      baseModel,
      ftModel,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      mode,
      categories,
    };
  }, []);

  return { running, progress, progressText, runTests };
}
