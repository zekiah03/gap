export type RelationshipTag =
  | "上司"
  | "同僚"
  | "部下"
  | "親"
  | "兄弟姉妹"
  | "恋人"
  | "配偶者"
  | "親友"
  | "友人"
  | "知人"
  | "SNS"
  | "その他";

export interface SituationCard {
  id: string;
  text: string;
  category: "職場" | "家族" | "恋愛" | "友人" | "社会";
  /** 感情価：理論論文 §10.3 の設計原則（ネガ/ニュートラル/ポジを均等配分） */
  valence: "negative" | "neutral" | "positive";
}

export interface Entry {
  id: string;
  createdAt: string; // ISO string
  situationText: string; // 既製カードのテキスト or カスタム入力
  isCustomSituation: boolean;
  honne: string; // 本音
  tatemae: string; // 建前
  relationship: RelationshipTag;
  // 0-10 の感情強度（本音側）
  emotionIntensity: number;
}
