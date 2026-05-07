import { SituationCard } from "@/types";

/**
 * 状況カード一覧。
 * 理論論文 §10.3 の設計原則に従い、各カテゴリで感情価（negative/neutral/positive）を
 * 均等に配分する。具体的すぎず抽象的すぎない記述を維持する。
 */
export const SITUATION_CARDS: SituationCard[] = [
  // ── 職場（negative × 4 / neutral × 3 / positive × 3） ──────────────
  { id: "w1",  text: "会議で自分の提案が上司にバッサリ否定された",               category: "職場", valence: "negative" },
  { id: "w2",  text: "同僚のミスを自分がカバーしなければならなかった",             category: "職場", valence: "negative" },
  { id: "w3",  text: "頑張った仕事をまったく評価されなかった",                   category: "職場", valence: "negative" },
  { id: "w4",  text: "自分より能力が低いと思う人が昇進した",                     category: "職場", valence: "negative" },
  { id: "w5",  text: "本当は行きたくない飲み会に誘われた",                       category: "職場", valence: "neutral"  },
  { id: "w6",  text: "無理な締め切りを一方的に設定された",                       category: "職場", valence: "negative" },
  { id: "w7",  text: "意見を求められたが、本当のことは言えなかった",             category: "職場", valence: "neutral"  },
  { id: "w8",  text: "仕事の成果をほめられたが、素直に受け取れなかった",         category: "職場", valence: "positive" },
  { id: "w9",  text: "職場で感謝の言葉をもらったとき、照れて流してしまった",     category: "職場", valence: "positive" },
  { id: "w10", text: "本当はやりたくない仕事を「わかりました」と引き受けた",     category: "職場", valence: "neutral"  },
  { id: "w11", text: "退職や転職を考えているが誰にも言えていない",               category: "職場", valence: "negative" },
  { id: "w12", text: "やりがいを感じた仕事を、過小評価して話した",               category: "職場", valence: "positive" },

  // ── 家族（negative × 4 / neutral × 2 / positive × 3） ──────────────
  { id: "f1",  text: "親に進路や人生の選択を反対された",                         category: "家族", valence: "negative" },
  { id: "f2",  text: "親から過度に干渉・心配された",                             category: "家族", valence: "negative" },
  { id: "f3",  text: "兄弟姉妹と比較された",                                     category: "家族", valence: "negative" },
  { id: "f4",  text: "家族に自分の悩みを打ち明けられなかった",                   category: "家族", valence: "negative" },
  { id: "f5",  text: "親に感謝を伝えたかったが、照れて言えなかった",             category: "家族", valence: "positive" },
  { id: "f6",  text: "家族のために自分の希望を後回しにした",                     category: "家族", valence: "neutral"  },
  { id: "f7",  text: "親の言葉が嬉しかったのに、素直に喜べなかった",             category: "家族", valence: "positive" },
  { id: "f8",  text: "家族と価値観の違いを感じたが、言葉にしなかった",           category: "家族", valence: "neutral"  },
  { id: "f9",  text: "久しぶりに会った家族に、本音で話せた気がした",             category: "家族", valence: "positive" },

  // ── 恋愛（negative × 3 / neutral × 2 / positive × 3） ──────────────
  { id: "r1",  text: "パートナーに不満があるが言い出せなかった",                 category: "恋愛", valence: "negative" },
  { id: "r2",  text: "デートの予定を相手の希望に合わせすぎた",                   category: "恋愛", valence: "neutral"  },
  { id: "r3",  text: "パートナーの言動が傷ついたが、笑って流した",               category: "恋愛", valence: "negative" },
  { id: "r4",  text: "好きな気持ちを、素直に伝えられなかった",                   category: "恋愛", valence: "positive" },
  { id: "r5",  text: "相手に感謝や愛情を感じたが、照れて表現できなかった",       category: "恋愛", valence: "positive" },
  { id: "r6",  text: "別れたいと思っているが、言い出せないでいる",               category: "恋愛", valence: "negative" },
  { id: "r7",  text: "相手の変化に気づいたが、何も言わなかった",                 category: "恋愛", valence: "neutral"  },
  { id: "r8",  text: "一緒にいて安心したが、それを言葉にしなかった",             category: "恋愛", valence: "positive" },

  // ── 友人（negative × 3 / neutral × 2 / positive × 3） ──────────────
  { id: "p1",  text: "友人に感謝されたとき、照れて素直に喜べなかった",           category: "友人", valence: "positive" },
  { id: "p2",  text: "グループの意見に乗り気でなかったが合わせた",               category: "友人", valence: "neutral"  },
  { id: "p3",  text: "友人に本当のことを言えなかった",                           category: "友人", valence: "negative" },
  { id: "p4",  text: "友人のことを羨ましいと思ったが、口には出せなかった",       category: "友人", valence: "negative" },
  { id: "p5",  text: "友人のプレゼントが嬉しかったのに、照れて伝えられなかった", category: "友人", valence: "positive" },
  { id: "p6",  text: "久しぶりに会った友人と、会えて嬉しいと言えなかった",       category: "友人", valence: "positive" },
  { id: "p7",  text: "友人の悩みに共感したが、何を返せばいいかわからなかった",   category: "友人", valence: "neutral"  },
  { id: "p8",  text: "友人と意見がぶつかったが、自分が折れた",                   category: "友人", valence: "negative" },

  // ── 社会（negative × 3 / neutral × 3 / positive × 2） ──────────────
  { id: "s1",  text: "SNSに本当の気持ちと違う投稿をした",                         category: "社会", valence: "negative" },
  { id: "s2",  text: "初対面の人に「いい人」を演じた",                           category: "社会", valence: "neutral"  },
  { id: "s3",  text: "誰かの発言に傷ついたが、何も言えなかった",                 category: "社会", valence: "negative" },
  { id: "s4",  text: "本当は怒っているのに、笑顔で「大丈夫です」と言った",       category: "社会", valence: "negative" },
  { id: "s5",  text: "自分の意見を持っていたが、場の空気を読んで黙った",         category: "社会", valence: "neutral"  },
  { id: "s6",  text: "見知らぬ人に親切にしてもらい、感謝したが言葉が出なかった", category: "社会", valence: "positive" },
  { id: "s7",  text: "体調が悪いのに「平気です」と言って動いた",                 category: "社会", valence: "neutral"  },
  { id: "s8",  text: "褒められて嬉しかったが「そんなことないです」と返した",     category: "社会", valence: "positive" },
];
