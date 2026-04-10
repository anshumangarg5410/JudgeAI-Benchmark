import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * AccuracyChart — Grouped bar chart comparing base vs fine-tuned accuracy
 */
export default function AccuracyChart({ summary, baseName, ftName }) {
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
      <BarChart data={data} barGap={4} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="#181f2e" vertical={false} />
        <XAxis
          dataKey="category"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11 }}
        />
        <YAxis
          domain={[0, 110]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: '#0f131e',
            border: '1px solid #181f2e',
            borderRadius: 8,
            fontSize: '0.82rem',
          }}
          formatter={(value) => `${value}%`}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
          iconType="square"
        />
        <Bar
          dataKey={baseName}
          fill="#38bdf8"
          opacity={0.85}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey={ftName}
          fill="#34d399"
          opacity={0.9}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
