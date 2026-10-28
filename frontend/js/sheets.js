/* ============================================================
 * sheets.js —— 内置乐谱库
 * 每条乐谱：notes 为音符序列，beats 表示占几拍（1=四分音符）
 * ============================================================ */

const SHEETS = [
  {
    id: "twinkle",
    name: "小星星",
    tempo: 100,
    notes: [
      { note: "C4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "G4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "A4", beats: 1 }, { note: "A4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "F4", beats: 1 }, { note: "F4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "D4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
    ]
  },
  {
    id: "ode",
    name: "欢乐颂",
    tempo: 110,
    notes: [
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "F4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "G4", beats: 1 }, { note: "F4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "D4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "E4", beats: 1.5 }, { note: "D4", beats: 0.5 },
      { note: "D4", beats: 2 },
    ]
  },
  {
    id: "birthday",
    name: "生日快乐",
    tempo: 90,
    notes: [
      { note: "C4", beats: 0.75 }, { note: "C4", beats: 0.25 },
      { note: "D4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "F4", beats: 1 }, { note: "E4", beats: 2 },
      { note: "C4", beats: 0.75 }, { note: "C4", beats: 0.25 },
      { note: "D4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "G4", beats: 1 }, { note: "F4", beats: 2 },
    ]
  },
  {
    id: "alice",
    name: "致爱丽丝(片段)",
    tempo: 120,
    notes: [
      { note: "E5", beats: 0.5 }, { note: "B4", beats: 0.5 },
      { note: "C5", beats: 0.5 }, { note: "D5", beats: 0.5 },
      { note: "C5", beats: 0.5 }, { note: "B4", beats: 0.5 },
      { note: "A4", beats: 0.5 }, { note: "A4", beats: 0.5 },
      { note: "C5", beats: 0.5 }, { note: "E5", beats: 0.5 },
      { note: "D5", beats: 0.5 }, { note: "C5", beats: 0.5 },
      { note: "B4", beats: 1.5 },
    ]
  },
  {
    id: "mary",
    name: "玛丽有只小羔羊 ★入门",
    tempo: 90,
    notes: [
      { note: "E4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "E4", beats: 2 },
      { note: "D4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "D4", beats: 2 },
      { note: "E4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "E4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "D4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
    ]
  },
  {
    id: "tiger",
    name: "两只老虎 ★入门",
    tempo: 100,
    notes: [
      { note: "C4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "C4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "F4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "E4", beats: 1 }, { note: "F4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "G4", beats: 0.5 }, { note: "A4", beats: 0.5 },
      { note: "G4", beats: 0.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "G4", beats: 0.5 }, { note: "A4", beats: 0.5 },
      { note: "G4", beats: 0.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "C4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "C4", beats: 2 },
      { note: "C4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "C4", beats: 2 },
    ]
  },
  {
    id: "rowrow",
    name: "划船曲 ★入门",
    tempo: 90,
    notes: [
      { note: "C4", beats: 1 }, { note: "C4", beats: 1 },
      { note: "C4", beats: 1.5 }, { note: "D4", beats: 0.5 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 0.5 },
      { note: "D4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "F4", beats: 0.5 }, { note: "G4", beats: 2 },
      { note: "C5", beats: 0.5 }, { note: "C5", beats: 0.5 },
      { note: "C5", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "G4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "E4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "E4", beats: 0.5 }, { note: "C4", beats: 0.5 },
      { note: "C4", beats: 0.5 }, { note: "C4", beats: 0.5 },
      { note: "G4", beats: 1.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
    ]
  },
  {
    id: "molihua",
    name: "茉莉花 ★简单",
    tempo: 80,
    notes: [
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "G4", beats: 1 }, { note: "A4", beats: 1 },
      { note: "A4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "E4", beats: 2 }, { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "G4", beats: 1 }, { note: "A4", beats: 1 },
      { note: "A4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "E4", beats: 2 }, { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
    ]
  },
  {
    id: "jingle",
    name: "铃儿响叮当 ★简单",
    tempo: 110,
    notes: [
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "E4", beats: 2 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "E4", beats: 2 },
      { note: "E4", beats: 1 }, { note: "G4", beats: 1 },
      { note: "C4", beats: 1.5 }, { note: "D4", beats: 0.5 },
      { note: "E4", beats: 4 },
      { note: "F4", beats: 1 }, { note: "F4", beats: 1 },
      { note: "F4", beats: 1.5 }, { note: "F4", beats: 0.5 },
      { note: "F4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "E4", beats: 1 }, { note: "E4", beats: 0.5 },
      { note: "E4", beats: 0.5 },
      { note: "E4", beats: 1 }, { note: "D4", beats: 1 },
      { note: "D4", beats: 1 }, { note: "E4", beats: 1 },
      { note: "D4", beats: 2 }, { note: "G4", beats: 2 },
    ]
  },
  {
    id: "huahai",
    name: "花海·副歌(C调白键版)",
    tempo: 75,
    notes: [
      // 不要你离开 (5 5 4 3 2) = G G F E D
      { note: "G4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "F4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "D4", beats: 1 },
      // 距离隔不开 (1 1 2 3 5) = C C D E G
      { note: "C4", beats: 0.5 }, { note: "C4", beats: 0.5 },
      { note: "D4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "G4", beats: 1 },
      // 思念变成海 (5 4 3 2 1) = G F E D C
      { note: "G4", beats: 0.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 0.5 }, { note: "D4", beats: 0.5 },
      { note: "C4", beats: 1 },
      // 在窗外进不来 (7 6 6 5 4) = B A A G F
      { note: "B4", beats: 0.5 }, { note: "A4", beats: 0.5 },
      { note: "A4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "F4", beats: 1.5 },
      // 原谅说太快 (5 5 4 3 2)
      { note: "G4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "F4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "D4", beats: 1 },
      // 爱成了阻碍 (1 1 2 3 5)
      { note: "C4", beats: 0.5 }, { note: "C4", beats: 0.5 },
      { note: "D4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "G4", beats: 1 },
      // 手中的风筝放太快回不来 (5 4 3 2 1 7 6 6 5 4 3 2 1)
      { note: "G4", beats: 0.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 0.5 }, { note: "D4", beats: 0.5 },
      { note: "C4", beats: 0.5 }, { note: "B4", beats: 0.5 },
      { note: "A4", beats: 0.5 }, { note: "A4", beats: 0.5 },
      { note: "G4", beats: 0.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 0.5 }, { note: "D4", beats: 0.5 },
      { note: "C4", beats: 1.5 },
      // 不要你离开 (5 5 4 3 2)
      { note: "G4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "F4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "D4", beats: 1 },
      // 回忆划不开 (1 1 2 3 5)
      { note: "C4", beats: 0.5 }, { note: "C4", beats: 0.5 },
      { note: "D4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "G4", beats: 1 },
      // 欠你的宠爱 (5 4 3 2 1)
      { note: "G4", beats: 0.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 0.5 }, { note: "D4", beats: 0.5 },
      { note: "C4", beats: 1 },
      // 我在等待重来 (7 6 6 5 4)
      { note: "B4", beats: 0.5 }, { note: "A4", beats: 0.5 },
      { note: "A4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "F4", beats: 1.5 },
      // 天空仍灿烂 (5 5 4 3 2)
      { note: "G4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "F4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "D4", beats: 1 },
      // 它爱着大海 (1 1 2 3 5)
      { note: "C4", beats: 0.5 }, { note: "C4", beats: 0.5 },
      { note: "D4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "G4", beats: 1 },
      // 情歌被打败 (5 4 3 2 1)
      { note: "G4", beats: 0.5 }, { note: "F4", beats: 0.5 },
      { note: "E4", beats: 0.5 }, { note: "D4", beats: 0.5 },
      { note: "C4", beats: 1 },
      // 爱已不存在 (7 6 6 5 4 3 2 1)
      { note: "B4", beats: 0.5 }, { note: "A4", beats: 0.5 },
      { note: "A4", beats: 0.5 }, { note: "G4", beats: 0.5 },
      { note: "F4", beats: 0.5 }, { note: "E4", beats: 0.5 },
      { note: "D4", beats: 0.5 }, { note: "C4", beats: 2 },
    ]
  }
];
