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
 * ErrorChart — Grouped bar chart comparing error counts
 */
export default function ErrorChart({ summary, baseName, ftName }) {
  const data = useMemo(
    () =>
      summary.map((row) => ({
        category: row.category,
        [baseName]: row.baseErr,
        [ftName]: row.ftErr,
      })),
    [summary, baseName, ftName]
  );

  return (
    <ResponsiveContainer width="100%" height={270}>
      <BarChart data={data} barGap={4} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="#181f2e" vertical={false} />
        <XAxis
          dataKey="category"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11 }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#0f131e',
            border: '1px solid #181f2e',
            borderRadius: 8,
            fontSize: '0.82rem',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
          iconType="square"
        />
        <Bar
          dataKey={baseName}
          fill="#f87171"
          opacity={0.7}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey={ftName}
          fill="#fb923c"
          opacity={0.9}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
