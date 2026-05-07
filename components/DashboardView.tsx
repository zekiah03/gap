"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { Entry } from "@/types";
import {
  computeClarity,
  computeRelationshipStats,
  computeTimeSeries,
  detectCriticalPoints,
  UcurveZone,
  RelationshipStats,
} from "@/lib/analysis";

interface DashboardViewProps {
  entries: Entry[];
}

// ─── ゾーン設定 ───────────────────────────────────────────────

const ZONE: Record<
  UcurveZone,
  { label: string; color: string; bgClass: string; textClass: string; desc: string }
> = {
  本音優位: {
    label: "本音優位",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-600",
    desc: "率直だが摩擦が生まれやすい",
  },
  適応域: {
    label: "適応域",
    color: "#10b981",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-600",
    desc: "本音と建前のバランスが取れている",
  },
  建前優位: {
    label: "建前優位",
    color: "#f43f5e",
    bgClass: "bg-rose-50",
    textClass: "text-rose-500",
    desc: "自己疎外・空虚感が生まれやすい",
  },
};

// ─── 気づきゲージ ─────────────────────────────────────────────

function ClarityGauge({ entryCount }: { entryCount: number }) {
  const pct = computeClarity(entryCount);

  const message =
    entryCount === 0
      ? "記録を始めると輪郭が見えてきます"
      : entryCount < 5
      ? `あと ${5 - entryCount} 件で最初の輪郭が現れます`
      : entryCount < 15
      ? `${entryCount} 件。15件でさらに解像度が上がります`
      : entryCount < 30
      ? `${entryCount} 件。30件で構造が見えてきます`
      : `${entryCount} 件。かなりの輪郭が見えています`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">気づきの蓄積</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            記録を重ねるほど自分の構造が見えてくる
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-indigo-600">{pct}</span>
          <span className="text-sm text-gray-400 ml-0.5">%</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
        <div
          className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  );
}

// ─── U字バー（関係性1件分） ───────────────────────────────────

function UcurveBar({ stat }: { stat: RelationshipStats }) {
  const cfg = ZONE[stat.zone];
  const pct = (stat.avgDeltaB / 10) * 100;

  const trendMark =
    stat.trend === "up" ? "↗" : stat.trend === "down" ? "↘" : "";
  const trendClass =
    stat.trend === "up"
      ? "text-rose-400"
      : stat.trend === "down"
      ? "text-emerald-400"
      : "text-gray-300";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{stat.relationship}</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bgClass} ${cfg.textClass}`}
          >
            {cfg.label}
          </span>
          {trendMark && (
            <span className={`text-xs font-bold ${trendClass}`}>{trendMark}</span>
          )}
          <span className="text-xs text-gray-300">{stat.count}件</span>
        </div>
      </div>

      {/* 三ゾーンバー */}
      <div className="relative h-3 rounded-full overflow-hidden flex cursor-default">
        <div className="w-[35%] bg-amber-100" title="本音優位ゾーン" />
        <div className="w-[30%] bg-emerald-100" title="適応域" />
        <div className="w-[35%] bg-rose-100" title="建前優位ゾーン" />
        {/* 現在地インジケーター */}
        <div
          className="absolute top-0 h-3 w-2.5 rounded-full -translate-x-1/2 shadow-sm transition-all duration-500"
          style={{ left: `${pct}%`, backgroundColor: cfg.color }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-300 px-0.5">
        <span>本音優位</span>
        <span>適応域</span>
        <span>建前優位</span>
      </div>
    </div>
  );
}

// ─── 臨界点アラート ───────────────────────────────────────────

function CriticalAlert({
  type,
  description,
  severity,
}: {
  type: string;
  description: string;
  severity: "notice" | "warning";
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 flex items-start gap-2.5 text-sm border ${
        severity === "warning"
          ? "bg-rose-50 border-rose-200 text-rose-700"
          : "bg-amber-50 border-amber-200 text-amber-700"
      }`}
    >
      <span className="mt-0.5 text-base">{severity === "warning" ? "⚠" : "○"}</span>
      <div>
        <span className="font-semibold mr-1">{type}</span>
        <span>{description}</span>
      </div>
    </div>
  );
}

// ─── メインダッシュボード ─────────────────────────────────────

export default function DashboardView({ entries }: DashboardViewProps) {
  const stats = computeRelationshipStats(entries);
  const timeSeries = computeTimeSeries(entries);
  const criticalPoints = detectCriticalPoints(entries);

  if (entries.length === 0) {
    return (
      <div className="space-y-5">
        <ClarityGauge entryCount={0} />
        <p className="text-center text-gray-400 py-8 text-sm">
          記録を始めると分析が表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 気づきゲージ */}
      <ClarityGauge entryCount={entries.length} />

      {/* 臨界点アラート */}
      {criticalPoints.map((cp, i) => (
        <CriticalAlert key={i} {...cp} />
      ))}

      {/* 関係性別 U字マップ */}
      {stats.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            関係性別 ΔB
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            誰の前で建前が厚くなるか。U字の右ほど建前優位、左ほど本音優位。
          </p>
          <div className="space-y-5">
            {stats.map((s) => (
              <UcurveBar key={s.relationship} stat={s} />
            ))}
          </div>

          {/* ゾーン凡例 */}
          <div className="mt-5 pt-4 border-t border-gray-50 grid grid-cols-3 gap-3">
            {(
              Object.entries(ZONE) as [
                UcurveZone,
                (typeof ZONE)[UcurveZone]
              ][]
            ).map(([zone, cfg]) => (
              <div key={zone} className="text-center">
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${cfg.bgClass} ${cfg.textClass}`}
                >
                  {cfg.label}
                </span>
                <p className="text-[10px] text-gray-400 leading-snug">
                  {cfg.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 時系列 */}
      {timeSeries.length >= 2 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">ΔB の推移</h3>
          <p className="text-xs text-gray-400 mb-4">
            破線は U字ゾーンの境界（上 = 建前優位、下 = 本音優位）。
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={timeSeries}
              margin={{ left: -16, right: 8, top: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v, _, p) => [
                  `${v}（${p.payload.count}件）`,
                  "ΔB",
                ]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              {/* 適応域の境界線 */}
              <ReferenceLine
                y={3.5}
                stroke="#f59e0b"
                strokeDasharray="4 3"
                strokeWidth={1.5}
              />
              <ReferenceLine
                y={6.5}
                stroke="#f43f5e"
                strokeDasharray="4 3"
                strokeWidth={1.5}
              />
              {/* 適応域の塗り */}
              <ReferenceLine
                y={5}
                stroke="#10b981"
                strokeOpacity={0.08}
                strokeWidth={60}
              />
              <Line
                type="monotone"
                dataKey="avgDeltaB"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {entries.length > 0 && entries.length < 3 && (
        <p className="text-center text-xs text-gray-400 pb-4">
          3件以上の記録でグラフが充実します
        </p>
      )}
    </div>
  );
}
