"use client";

import { useState } from "react";
import { SITUATION_CARDS } from "@/lib/cards";
import { saveEntry } from "@/lib/storage";
import { Entry, RelationshipTag, SituationCard } from "@/types";

const RELATIONSHIP_TAGS: RelationshipTag[] = [
  "上司", "同僚", "部下", "親", "兄弟姉妹",
  "恋人", "配偶者", "親友", "友人", "知人", "SNS", "その他",
];

const CATEGORIES = ["すべて", "職場", "家族", "恋愛", "友人", "社会"] as const;
const VALENCES = ["すべて", "ネガティブ", "ニュートラル", "ポジティブ"] as const;
const VALENCE_MAP: Record<string, string> = {
  ネガティブ: "negative",
  ニュートラル: "neutral",
  ポジティブ: "positive",
};

interface ProbeFormProps {
  onSaved: () => void;
}

export default function ProbeForm({ onSaved }: ProbeFormProps) {
  const [step, setStep] = useState<"card" | "write">("card");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [selectedValence, setSelectedValence] = useState<string>("すべて");
  const [selectedCard, setSelectedCard] = useState<SituationCard | null>(null);
  const [customSituation, setCustomSituation] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [honne, setHonne] = useState("");
  const [tatemae, setTatemae] = useState("");
  const [relationship, setRelationship] = useState<RelationshipTag | "">("");
  const [intensity, setIntensity] = useState(5);

  const filteredCards = SITUATION_CARDS.filter((c) => {
    const catOk = selectedCategory === "すべて" || c.category === selectedCategory;
    const valOk =
      selectedValence === "すべて" ||
      c.valence === VALENCE_MAP[selectedValence];
    return catOk && valOk;
  });

  const situationText = useCustom ? customSituation : selectedCard?.text ?? "";

  function handleCardSelect(card: SituationCard) {
    setSelectedCard(card);
    setUseCustom(false);
    setStep("write");
  }

  function handleCustomSubmit() {
    if (!customSituation.trim()) return;
    setUseCustom(true);
    setSelectedCard(null);
    setStep("write");
  }

  function handleSave() {
    if (!honne.trim() || !tatemae.trim() || !relationship) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      situationText,
      isCustomSituation: useCustom,
      honne,
      tatemae,
      relationship: relationship as RelationshipTag,
      emotionIntensity: intensity,
    };
    saveEntry(entry);
    // reset
    setStep("card");
    setSelectedCard(null);
    setCustomSituation("");
    setUseCustom(false);
    setHonne("");
    setTatemae("");
    setRelationship("");
    setIntensity(5);
    onSaved();
  }

  if (step === "card") {
    return (
      <div className="space-y-6">
        {/* カテゴリフィルタ */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 感情価フィルタ */}
        <div className="flex flex-wrap gap-2">
          {VALENCES.map((v) => {
            const colors: Record<string, string> = {
              すべて: "bg-gray-100 text-gray-600",
              ネガティブ: "bg-rose-100 text-rose-600",
              ニュートラル: "bg-gray-100 text-gray-600",
              ポジティブ: "bg-emerald-100 text-emerald-600",
            };
            const activeColors: Record<string, string> = {
              すべて: "bg-gray-700 text-white",
              ネガティブ: "bg-rose-500 text-white",
              ニュートラル: "bg-gray-500 text-white",
              ポジティブ: "bg-emerald-500 text-white",
            };
            return (
              <button
                key={v}
                onClick={() => setSelectedValence(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedValence === v ? activeColors[v] : colors[v]
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>

        {/* 既製カード一覧 */}
        <div className="grid gap-3">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardSelect(card)}
              className="text-left p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors group"
            >
              <span className="text-xs font-medium text-indigo-500 mb-1 block">
                {card.category}
              </span>
              <span className="text-gray-800 group-hover:text-indigo-800">
                {card.text}
              </span>
            </button>
          ))}
        </div>

        {/* 自由入力 */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-2">
            当てはまるカードがない場合は自分で書く
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSituation}
              onChange={(e) => setCustomSituation(e.target.value)}
              placeholder="今日あった状況を書いてください"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customSituation.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-indigo-700 transition-colors"
            >
              次へ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // step === "write"
  return (
    <div className="space-y-6">
      {/* 状況表示 */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-xs font-medium text-indigo-500 mb-1">状況</p>
        <p className="text-gray-800 font-medium">{situationText}</p>
        <button
          onClick={() => setStep("card")}
          className="mt-2 text-xs text-indigo-400 hover:text-indigo-600 underline"
        >
          ← 状況を変える
        </button>
      </div>

      {/* 二欄入力 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-rose-600 mb-2">
            本音
          </label>
          <textarea
            value={honne}
            onChange={(e) => setHonne(e.target.value)}
            placeholder="実際に感じたこと、思ったこと"
            rows={5}
            className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-sky-600 mb-2">
            建前
          </label>
          <textarea
            value={tatemae}
            onChange={(e) => setTatemae(e.target.value)}
            placeholder="実際にとった言動、表に出した反応"
            rows={5}
            className="w-full border border-sky-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
          />
        </div>
      </div>

      {/* 感情強度 */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          本音の感情の強さ：<span className="font-bold text-gray-900">{intensity}</span>
        </label>
        <input
          type="range"
          min={0}
          max={10}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full accent-rose-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0（ほぼない）</span>
          <span>10（非常に強い）</span>
        </div>
      </div>

      {/* 関係性タグ */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          誰の前でしたか？
        </label>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIP_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setRelationship(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                relationship === tag
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        disabled={!honne.trim() || !tatemae.trim() || !relationship}
        className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl disabled:opacity-40 hover:bg-gray-700 transition-colors"
      >
        記録する
      </button>
    </div>
  );
}
