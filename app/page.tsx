"use client";

import { useState, useEffect, useCallback } from "react";
import ProbeForm from "@/components/ProbeForm";
import EntryList from "@/components/EntryList";
import DashboardView from "@/components/DashboardView";
import { loadEntries, deleteEntry } from "@/lib/storage";
import { contributeToTwin } from "@/lib/contribute";
import { Entry } from "@/types";

type Tab = "record" | "list" | "chart";

export default function Home() {
  const [tab, setTab] = useState<Tab>("record");
  const [entries, setEntries] = useState<Entry[]>([]);

  const reload = useCallback(() => {
    setEntries(loadEntries());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (entries.length === 0) return;
    if (sessionStorage.getItem('gap_contributed')) return;
    sessionStorage.setItem('gap_contributed', '1');
    contributeToTwin('gap', {
      entryCount: entries.length,
      relationships: Object.entries(
        entries.reduce((acc: Record<string, number>, e) => {
          acc[e.relationship] = (acc[e.relationship] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([relationship, count]) => ({ relationship, count })),
    });
  }, [entries]);

  function handleDelete(id: string) {
    deleteEntry(id);
    reload();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">gap</h1>
          <p className="text-xs text-gray-400 mt-0.5">本音と建前の距離を見る</p>
        </div>
      </header>

      {/* タブ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-0">
            {(
              [
                { id: "record", label: "記録する" },
                { id: "list", label: `一覧（${entries.length}）` },
                { id: "chart", label: "分析" },
              ] as { id: Tab; label: string }[]
            ).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === "record" && (
          <ProbeForm
            onSaved={() => {
              reload();
              setTab("list");
            }}
          />
        )}
        {tab === "list" && (
          <EntryList entries={entries} onDelete={handleDelete} />
        )}
        {tab === "chart" && <DashboardView entries={entries} />}
      </main>
    </div>
  );
}
