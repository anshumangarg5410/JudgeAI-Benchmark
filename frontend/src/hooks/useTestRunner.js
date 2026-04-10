/**
 * useTestRunner — Custom hook for running evaluations
 * Calls the Node proxy -> Flask microservice for real results
 */
import { useState, useCallback } from 'react';
import { evaluateApi } from '../services/api';

const RUN_STEPS = {
  Fast: [
    { message: 'Initialising…', duration: 300 },
    { message: 'Evaluating…', duration: 600 },
    { message: 'Scoring…', duration: 300 },
  ],
  Standard: [
    { message: 'Initialising…', duration: 300 },
    { message: 'Querying backend…', duration: 800 },
    { message: 'Awaiting Flask evaluation…', duration: 1500 },
    { message: 'Computing metrics…', duration: 400 },
    { message: 'Generating insights…', duration: 300 },
  ],
  'Deep Eval': [
    { message: 'Initialising…', duration: 300 },
    { message: 'Deep evaluation started…', duration: 1500 },
    { message: 'Evaluating models…', duration: 2000 },
    { message: 'Calibrating…', duration: 600 },
    { message: 'Finalising…', duration: 400 },
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

    // Start progress animation asynchronously (visual only)
    const animatePromise = (async () => {
      for (let i = 0; i < steps.length - 1; i++) {
        if (!running) break;
        setProgressText(steps[i].message);
        setProgress(Math.round(((i + 1) / steps.length) * 100));
        await new Promise((r) => setTimeout(r, steps[i].duration));
      }
    })();

    try {
      // Call Real Backend Endpoint
      const evalData = await evaluateApi.run({
        baseModel: baseModel.id,
        ftModel: ftModel.id,
        categories,
        mode,
      });

      // Format results by zipping Base and FT details
      const rows = [];
      const summary = [];

      // Process individual test rows
      if (evalData.baseDetails && evalData.fineDetails) {
        evalData.baseDetails.forEach((bDetail, idx) => {
          const fDetail = evalData.fineDetails[idx];
          
          rows.push({
            category: bDetail.category,
            testId: `${bDetail.category.slice(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, '0')}`,
            prompt: bDetail.question,
            expected: bDetail.expected,
            baseActual: bDetail.actual,
            ftActual: fDetail.actual,
            baseAcc: bDetail.passed ? 1.0 : 0.0,
            ftAcc: fDetail.passed ? 1.0 : 0.0,
            deltaAcc: +( (fDetail.passed ? 1.0 : 0.0) - (bDetail.passed ? 1.0 : 0.0) ).toFixed(2),
            baseLat: 0.1, // Note: Latency not yet provided by Flask
            ftLat: 0.1,
            baseErr: 0,
            ftErr: 0,
          });
        });
      }
      
      // Process Summary
      for (const cat of categories) {
        const bAcc = (evalData.base?.[cat] || 0) / 100;
        const fAcc = (evalData.fine?.[cat] || 0) / 100;
        
        summary.push({
          category: cat,
          baseAcc: bAcc,
          ftAcc: fAcc,
          baseLat: 0.1,
          ftLat: 0.1,
          baseErr: 0,
          ftErr: 0,
          tests: evalData.baseDetails?.filter(d => d.category === cat).length || 0,
        });
      }

      await animatePromise; 

      
      setProgressText(steps[steps.length - 1].message);
      setProgress(100);
      await new Promise((r) => setTimeout(r, minTime));

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
    } catch (error) {
      setRunning(false);
      setProgress(0);
      setProgressText('');
      throw error;
    }
  }, [running]);

  const minTime = 300;

  return { running, progress, progressText, runTests };
}
