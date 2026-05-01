"use client";

import { Entry } from "@/types";

interface EntryListProps {
  entries: Entry[];
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EntryList({ entries, onDelete }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12 text-sm">
        まだ記録がありません
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-medium text-indigo-500">
                {entry.relationship}
              </span>
              <span className="text-xs text-gray-400 ml-2">{formatDate(entry.createdAt)}</span>
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="text-xs text-gray-300 hover:text-red-400 transition-colors"
            >
              削除
            </button>
          </div>

          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            {entry.situationText}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-rose-500 mb-1">本音</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{entry.honne}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-500 mb-1">建前</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{entry.tatemae}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">感情強度</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-rose-400 h-1.5 rounded-full"
                style={{ width: `${entry.emotionIntensity * 10}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {entry.emotionIntensity}/10
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
