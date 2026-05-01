"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Entry, RelationshipTag } from "@/types";

interface GapChartProps {
  entries: Entry[];
}

function computeGap(entry: Entry): number {
  // ΔB の近似：本音と建前の文字数の差 × 感情強度で重み付け
  const diff = Math.abs(entry.honne.length - entry.tatemae.length);
  const normalized = Math.min(diff / 200, 1); // 200文字差で最大
  return Math.round(normalized * entry.emotionIntensity * 10) / 10;
}

export default function GapChart({ entries }: GapChartProps) {
  if (entries.length === 0) return null;

  // 関係性ごとの平均ギャップを集計
  const byRelationship: Record<string, { total: number; count: number }> = {};
  for (const entry of entries) {
    if (!byRelationship[entry.relationship]) {
      byRelationship[entry.relationship] = { total: 0, count: 0 };
    }
    byRelationship[entry.relationship].total += computeGap(entry);
    byRelationship[entry.relationship].count += 1;
  }

  const data = Object.entries(byRelationship)
    .map(([rel, { total, count }]) => ({
      name: rel as RelationshipTag,
      gap: Math.round((total / count) * 10) / 10,
      count,
    }))
    .sort((a, b) => b.gap - a.gap);

  const maxGap = Math.max(...data.map((d) => d.gap));

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">
        ΔB（本音と建前のギャップ）の関係性別平均。文字量差 × 感情強度による近似値。
      </p>
      <ResponsiveContainer width="100%" height={data.length * 52 + 40}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
        >
          <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, _name, props) => [
              `${value}（${props.payload.count}件）`,
              "ギャップ",
            ]}
          />
          <Bar dataKey="gap" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.gap >= maxGap * 0.8 ? "#f87171" : entry.gap >= maxGap * 0.5 ? "#fb923c" : "#60a5fa"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
