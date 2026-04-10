import { useMemo } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * RadarChart — Spider chart comparing multi-category performance
 */
export default function RadarChart({ summary, baseName, ftName }) {
  const data = useMemo(
    () =>
      summary.map((row) => ({
        category: row.category,
        [baseName]: +(row.baseAcc * 100).toFixed(1),
        [ftName]: +(row.ftAcc * 100).toFixed(1),
      })),
    [summary, baseName, ftName]
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#181f2e" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: '#64748b', fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#3d5068', fontSize: 9 }}
          tickFormatter={(v) => `${v}%`}
          axisLine={false}
        />
        <Radar
          name={baseName}
          dataKey={baseName}
          stroke="#38bdf8"
          fill="#38bdf8"
          fillOpacity={0.1}
          strokeWidth={2}
        />
        <Radar
          name={ftName}
          dataKey={ftName}
          stroke="#a78bfa"
          fill="#a78bfa"
          fillOpacity={0.1}
          strokeWidth={2}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
