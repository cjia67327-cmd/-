/* ============================================================
 * server.js —— Node.js + Express 后端
 * 功能：保存/列出用户弹奏录音
 * 启动：npm install && node server.js
 * ============================================================ */

const express = require("express");
const multer  = require("multer");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 允许跨域（前端 Netlify 域名要访问本后端）
app.use(cors());
app.use(express.json());

// 录音文件存放目录
const RECORD_DIR = path.join(__dirname, "recordings");
if (!fs.existsSync(RECORD_DIR)) fs.mkdirSync(RECORD_DIR, { recursive: true });

// 静态托管录音文件
app.use("/recordings", express.static(RECORD_DIR));

// multer 配置：把上传的音频存为 recordings/<时间戳>.webm
const storage = multer.diskStorage({
  destination: RECORD_DIR,
  filename: (req, file, cb) => {
    const id = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    cb(null, id + ".webm");
  }
});
const upload = multer({ storage });

// 元数据索引文件
const INDEX_FILE = path.join(RECORD_DIR, "index.json");
function readIndex() {
  try { return JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8")); }
  catch { return []; }
}
function writeIndex(list) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(list, null, 2));
}

// ---------- API ----------

// 健康检查
app.get("/api/health", (req, res) => res.json({ ok: true }));

// 保存作品：multipart/form-data，字段 audio=音频文件，meta=JSON 字符串
app.post("/api/saves", upload.single("audio"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "缺少音频文件" });
  let meta = {};
  try { meta = JSON.parse(req.body.meta || "{}"); } catch {}

  const list = readIndex();
  const item = {
    id: req.file.filename.replace(/\.webm$/, ""),
    name: meta.name || "未命名作品",
    createdAt: new Date().toISOString(),
    duration: meta.duration || 0,
    score: meta.score || 0,
    accuracy: meta.accuracy || "--",
    audioUrl: "/recordings/" + req.file.filename,
    keys: meta.keys || []
  };
  list.unshift(item);
  writeIndex(list);
  res.json({ ok: true, item });
});

// 作品列表
app.get("/api/saves", (req, res) => {
  res.json(readIndex());
});

// 单条作品详情
app.get("/api/saves/:id", (req, res) => {
  const item = readIndex().find(x => x.id === req.params.id);
  item ? res.json(item) : res.status(404).json({ error: "not found" });
});

app.listen(PORT, () => console.log(`✅ PianoFlow 后端已启动: http://localhost:${PORT}`));
