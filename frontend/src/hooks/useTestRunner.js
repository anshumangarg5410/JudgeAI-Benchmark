/**
 * useTestRunner — Custom hook for running evaluations
 * Calls the Node proxy -> Flask microservice for real results
 */
import { useState, useCallback } from 'react';
import { evaluateApi } from '../services/api';

export function useTestRunner() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [logs, setLogs] = useState([]);

  const runTests = useCallback(async ({ baseModel, ftModel, categories, mode }) => {
    setRunning(true);
    setProgress(0);
    setProgressText('Initialising evaluation benchmark...');
    setLogs([]);

    const aggregatedBaseDetails = [];
    const aggregatedFineDetails = [];
    const aggregatedBaseSummary = {};
    const aggregatedFineSummary = {};

    try {
      // Process one category at a time for LIVE progress
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        const currentProgress = Math.round((i / categories.length) * 100);
        
        setProgress(currentProgress);
        setProgressText(`[${i + 1}/${categories.length}] Evaluating ${cat}...`);

        // Call Real Backend Endpoint
        const evalData = await evaluateApi.run({
          baseModel: baseModel.id,
          ftModel: ftModel.id,
          categories: [cat],
          mode,
        });

        // Add to live logs
        if (evalData.baseDetails) {
          const newLogs = evalData.baseDetails.map((b, idx) => {
            const f = evalData.fineDetails[idx];
            return {
              id: `${cat}-${i}-${idx}-${Date.now()}`,
              category: cat,
              question: b.question,
              baseActual: b.actual,
              ftActual: f.actual,
              passed: b.passed && f.passed
            };
          });
          setLogs(prev => [...newLogs, ...prev].slice(0, 50));
        }

        // Accumulate details
        if (evalData.baseDetails) aggregatedBaseDetails.push(...evalData.baseDetails);
        if (evalData.fineDetails) aggregatedFineDetails.push(...evalData.fineDetails);
        
        // Accumulate summaries
        if (evalData.base) Object.assign(aggregatedBaseSummary, evalData.base);
        if (evalData.fine) Object.assign(aggregatedFineSummary, evalData.fine);
      }

      // Final processing of aggregated results
      const rows = [];
      const summary = [];

      // Process individual test rows
      aggregatedBaseDetails.forEach((bDetail, idx) => {
        const fDetail = aggregatedFineDetails[idx];
        
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
          baseExplanation: bDetail.explanation,
          ftExplanation: fDetail.explanation,
        });
      });
      
      // Process Summary for each category
      for (const cat of categories) {
        const bAcc = (aggregatedBaseSummary[cat] || 0) / 100;
        const fAcc = (aggregatedFineSummary[cat] || 0) / 100;
        
        summary.push({
          category: cat,
          baseAcc: bAcc,
          ftAcc: fAcc,
          baseLat: 0.1,
          ftLat: 0.1,
          baseErr: 0,
          ftErr: 0,
          tests: aggregatedBaseDetails.filter(d => d.category === cat).length,
        });
      }
      
      setProgress(100);
      setProgressText('Evaluation complete! Finalising report...');
      await new Promise((r) => setTimeout(r, 800)); // Brief pause for UX

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
  }, []); 

  return { running, progress, progressText, logs, runTests };
}
