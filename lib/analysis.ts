import { Entry, RelationshipTag } from "@/types";

// 感情語リスト（本音記述の感情密度を推定するための簡易辞書）
const EMOTIONAL_KEYWORDS = [
  "嫌い", "嫌だ", "嫌な", "ムカ", "腹が立", "怒り", "怒る", "イライラ",
  "悲し", "つらい", "辛い", "苦し", "しんどい", "疲れた", "つかれ",
  "不満", "不安", "怖い", "恐い", "傷つ", "悔し", "焦り", "憎い",
  "嫉妬", "羨まし", "虚し", "孤独", "寂し", "落ち込", "失望",
  "ストレス", "きつい", "うんざり", "もういや", "限界",
  "嬉し", "楽し", "幸せ", "好き", "愛し", "感謝", "ありがとう",
  "安心", "うれし", "たのし", "よかっ", "最高", "感動",
];

function emotionalDensity(text: string): number {
  if (!text || text.length === 0) return 0;
  const count = EMOTIONAL_KEYWORDS.filter((kw) => text.includes(kw)).length;
  return Math.min(count / 4, 1); // 4語以上で 1.0
}

/**
 * ΔB（本音-建前距離）を 0〜10 で返す。
 * 理論論文 §4.2 の加重和を実装。
 *   w1=0.35 : 記述量の非対称性（本音と建前の文字数差）
 *   w2=0.35 : 感情語密度の差（本音の感情量 vs 建前の感情量）
 *   w3=0.30 : 感情強度スライダー
 */
export function computeDeltaB(entry: Entry): number {
  const honneLen = entry.honne.trim().length;
  const tatemaeLen = entry.tatemae.trim().length;
  const totalLen = honneLen + tatemaeLen;

  const lenAsymmetry =
    totalLen > 0 ? Math.abs(honneLen - tatemaeLen) / totalLen : 0;

  const honneEmotion = emotionalDensity(entry.honne);
  const tatemaeEmotion = emotionalDensity(entry.tatemae);
  const emotionGap = Math.min(Math.abs(honneEmotion - tatemaeEmotion), 1);

  const intensityFactor = entry.emotionIntensity / 10;

  const raw = 0.35 * lenAsymmetry + 0.35 * emotionGap + 0.3 * intensityFactor;
  return Math.round(raw * 100) / 10; // 0.0〜10.0
}

// ─── U字モデル ────────────────────────────────────────────────

export type UcurveZone = "本音優位" | "適応域" | "建前優位";

/**
 * ΔB値から U字モデルのゾーンを返す。
 * 閾値は理論論文 §2.3 の定性的記述を数値化したもの（将来的にユーザーデータで補正）。
 *   [0,   3.5) → 本音優位（ΔB が低すぎる）
 *   [3.5, 6.5] → 適応域
 *   (6.5, 10]  → 建前優位（ΔB が高すぎる）
 */
export function getUcurveZone(deltaB: number): UcurveZone {
  if (deltaB < 3.5) return "本音優位";
  if (deltaB <= 6.5) return "適応域";
  return "建前優位";
}

// ─── 関係性別統計 ─────────────────────────────────────────────

export interface RelationshipStats {
  relationship: RelationshipTag;
  avgDeltaB: number;
  count: number;
  zone: UcurveZone;
  trend: "up" | "down" | "stable";
}

export function computeRelationshipStats(entries: Entry[]): RelationshipStats[] {
  const byRel: Record<string, Entry[]> = {};
  for (const entry of entries) {
    if (!byRel[entry.relationship]) byRel[entry.relationship] = [];
    byRel[entry.relationship].push(entry);
  }

  return Object.entries(byRel)
    .map(([rel, relEntries]) => {
      // 時系列順（古い順）に並べて ΔB を計算
      const sorted = [...relEntries].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const deltaBs = sorted.map(computeDeltaB);
      const avg =
        deltaBs.reduce((a, b) => a + b, 0) / deltaBs.length;
      const rounded = Math.round(avg * 10) / 10;

      let trend: "up" | "down" | "stable" = "stable";
      if (deltaBs.length >= 3) {
        const last = deltaBs.slice(-3);
        const slope = last[2] - last[0];
        if (slope > 0.8) trend = "up";
        else if (slope < -0.8) trend = "down";
      }

      return {
        relationship: rel as RelationshipTag,
        avgDeltaB: rounded,
        count: relEntries.length,
        zone: getUcurveZone(rounded),
        trend,
      };
    })
    .sort((a, b) => b.avgDeltaB - a.avgDeltaB);
}

// ─── 時系列 ───────────────────────────────────────────────────

export interface TimePoint {
  label: string; // 表示用ラベル（M/D）
  avgDeltaB: number;
  count: number;
}

export function computeTimeSeries(entries: Entry[]): TimePoint[] {
  // 古い順に並べて日付ごとに集計
  const sorted = [...entries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const byDate: Record<string, number[]> = {};
  for (const entry of sorted) {
    const date = entry.createdAt.slice(0, 10);
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(computeDeltaB(entry));
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => {
      const [, m, d] = date.split("-");
      return {
        label: `${parseInt(m)}/${parseInt(d)}`,
        avgDeltaB:
          Math.round(
            (values.reduce((a, b) => a + b, 0) / values.length) * 10
          ) / 10,
        count: values.length,
      };
    });
}

// ─── 臨界点検出 ───────────────────────────────────────────────

export interface CriticalPoint {
  type: "急増" | "急減" | "高止まり";
  description: string;
  severity: "notice" | "warning";
}

export function detectCriticalPoints(entries: Entry[]): CriticalPoint[] {
  if (entries.length < 5) return [];

  const points: CriticalPoint[] = [];
  const recent = [...entries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .reverse()
    .map(computeDeltaB);

  // 急増：最新3件の平均 - 前3件の平均 > 2.0
  if (recent.length >= 6) {
    const newAvg = (recent[recent.length-1] + recent[recent.length-2] + recent[recent.length-3]) / 3;
    const oldAvg = (recent[recent.length-4] + recent[recent.length-5] + recent[recent.length-6]) / 3;
    if (newAvg - oldAvg > 2.0) {
      points.push({
        type: "急増",
        description: "最近、建前が急に厚くなっています。何か変化がありましたか？",
        severity: "notice",
      });
    }
    if (oldAvg - newAvg > 2.0) {
      points.push({
        type: "急減",
        description: "最近、本音が出やすくなっています。何か安全な場所が増えましたか？",
        severity: "notice",
      });
    }
  }

  // 高止まり：最新5件すべてが 6.5 以上
  if (recent.length >= 5 && recent.slice(-5).every((v) => v >= 6.5)) {
    points.push({
      type: "高止まり",
      description: "しばらく建前が厚い状態が続いています。本音を話せる相手はいますか？",
      severity: "warning",
    });
  }

  return points;
}

// ─── 気づきの蓄積（clarity） ─────────────────────────────────

/**
 * clarity(t) = 1 - exp(-λn) * cos(ωn) を 0〜100% に正規化。
 * 理論論文 §7.3 の数式を実装。
 * n = エントリー数。λ=0.12, ω=0.8。
 */
export function computeClarity(entryCount: number): number {
  if (entryCount === 0) return 0;
  const lambda = 0.12;
  const omega = 0.8;
  const raw =
    1 - Math.exp(-lambda * entryCount) * Math.cos(omega * entryCount);
  return Math.max(0, Math.min(100, Math.round(raw * 100)));
}
