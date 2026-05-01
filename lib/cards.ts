import { SituationCard } from "@/types";

export const SITUATION_CARDS: SituationCard[] = [
  // 職場
  { id: "w1", text: "会議で自分の提案が上司にバッサリ否定された", category: "職場" },
  { id: "w2", text: "同僚のミスを自分がカバーしなければならなかった", category: "職場" },
  { id: "w3", text: "頑張った仕事をまったく評価されなかった", category: "職場" },
  { id: "w4", text: "自分より明らかに能力が低いと思う人が昇進した", category: "職場" },
  { id: "w5", text: "本当は行きたくない飲み会に誘われた", category: "職場" },
  { id: "w6", text: "無理な締め切りを一方的に設定された", category: "職場" },
  // 家族
  { id: "f1", text: "親に進路や人生の選択を反対された", category: "家族" },
  { id: "f2", text: "親から過度に干渉・心配された", category: "家族" },
  { id: "f3", text: "兄弟姉妹と比較された", category: "家族" },
  { id: "f4", text: "家族に自分の悩みを打ち明けられなかった", category: "家族" },
  // 恋愛
  { id: "r1", text: "パートナーに不満があるが言い出せなかった", category: "恋愛" },
  { id: "r2", text: "デートや予定を相手の希望に合わせすぎた", category: "恋愛" },
  { id: "r3", text: "パートナーの言動が傷つけてきたが笑って流した", category: "恋愛" },
  // 友人
  { id: "p1", text: "友人に感謝されたとき、照れて素直に喜べなかった", category: "友人" },
  { id: "p2", text: "グループの意見に乗り気でないが合わせた", category: "友人" },
  { id: "p3", text: "友人に本当のことを言えなかった", category: "友人" },
  // 社会
  { id: "s1", text: "SNSに本当の気持ちと違う投稿をした", category: "社会" },
  { id: "s2", text: "初対面の人に「いい人」を演じた", category: "社会" },
  { id: "s3", text: "誰かの発言に傷ついたが何も言えなかった", category: "社会" },
];
