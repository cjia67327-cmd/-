/* ============================================================
 * app.js —— 主入口：串联钢琴、乐谱、游戏、录音、后端通信
 * ============================================================ */

// ---------- 全局实例 ----------
const piano     = new Piano("#piano");
const game      = new Game({
  onScore: (score, combo, acc) => updateStats(score, combo, acc),
  onEnd:   () => onGameEnd()
});
const recorder  = new Recorder();

let currentMode = "free";       // free | game
let currentSheet = SHEETS[0];
let recordedData = null;        // 最近一次停止录音后的结果
let apiBase = localStorage.getItem("apiBase") || "";

// ---------- 初始化 ----------
document.addEventListener("DOMContentLoaded", () => {
  initSheetSelect();
  renderSheetVisual(currentSheet);
  bindUI();
  checkApi();
  observeReveal();
  // 用户第一次点击/按键时提前加载钢琴采样
  const warmup = () => { audioEngine.ensureContext(); window.removeEventListener("pointerdown", warmup); window.removeEventListener("keydown", warmup); };
  window.addEventListener("pointerdown", warmup);
  window.addEventListener("keydown", warmup);
});

// ---------- 乐谱下拉框 ----------
function initSheetSelect() {
  const sel = document.getElementById("sheetSelect");
  SHEETS.forEach((s, i) => {
    const opt = document.createElement("option");
    opt.value = i; opt.textContent = s.name;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", () => {
    currentSheet = SHEETS[sel.value];
    renderSheetVisual(currentSheet);
    document.getElementById("startGameBtn").disabled = (currentMode !== "game");
  });
}

// ---------- 静态乐谱可视化 ----------
function renderSheetVisual(sheet) {
  const box = document.getElementById("sheetVisual");
  box.innerHTML = "";
  sheet.notes.forEach(n => {
    const chip = document.createElement("div");
    chip.className = "sheet-chip";
    chip.innerHTML = `<div>${n.note.replace("#", "♯")}</div><div class="cn">${n.beats}拍</div>`;
    box.appendChild(chip);
  });
}

// ---------- 事件绑定 ----------
function bindUI() {
  // 模式切换
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setMode(btn.dataset.mode);
    });
  });

  // 钢琴按键回调
  piano.onNoteOn  = note => {
    recorder.logKey(note, "down");
    game.onKeyDown(note);
    highlightSheetChip(note);
  };
  piano.onNoteOff = note => recorder.logKey(note, "up");

  // 录音按钮
  document.getElementById("recordBtn").addEventListener("click", startRecording);
  document.getElementById("stopRecBtn").addEventListener("click", stopRecording);
  document.getElementById("playbackBtn").addEventListener("click", () => {
    if (recordedData) recorder.playback(recordedData.audioBlob, recordedData.keys, piano);
  });
  document.getElementById("pauseBtn").addEventListener("click", () => recorder.pausePlayback());

  // 音量 / 速度
  document.getElementById("volume").addEventListener("input", e =>
    audioEngine.setVolume(e.target.value / 100)
  );
  document.getElementById("speed").addEventListener("input", e => {
    document.getElementById("speedVal").textContent = e.target.value;
    document.getElementById("statSpeed").textContent = e.target.value;
  });

  // 跟弹开始/停止
  document.getElementById("startGameBtn").addEventListener("click", startGame);
  document.getElementById("stopGameBtn").addEventListener("click", stopGame);

  // 保存作品
  document.getElementById("saveBtn").addEventListener("click", saveWork);

  // 后端地址
  const apiInput = document.getElementById("apiBase");
  apiInput.value = apiBase;
  apiInput.addEventListener("change", () => {
    apiBase = apiInput.value.trim().replace(/\/$/, "");
    localStorage.setItem("apiBase", apiBase);
    checkApi();
  });
}

// ---------- 模式切换 ----------
function setMode(mode) {
  currentMode = mode;
  document.getElementById("gameTrack").style.display = mode === "game" ? "block" : "none";
  document.getElementById("startGameBtn").disabled = mode !== "game";
  if (mode === "free") stopGame();
}

// ---------- 跟弹逻辑 ----------
function startGame() {
  const bpm = parseInt(document.getElementById("speed").value, 10);
  game.loadSheet(currentSheet, bpm);
  game.start();
  document.getElementById("startGameBtn").style.display = "none";
  document.getElementById("stopGameBtn").style.display = "inline-block";
}
function stopGame() {
  game.stop();
  document.getElementById("startGameBtn").style.display = "inline-block";
  document.getElementById("stopGameBtn").style.display = "none";
}
function onGameEnd() {
  stopGame();
  alert(`闯关结束！得分 ${game.score}，正确率 ${document.getElementById("statAccuracy").textContent}`);
}

function updateStats(score, combo, acc) {
  document.getElementById("statScore").textContent = score;
  document.getElementById("statCombo").textContent = combo;
  document.getElementById("statAccuracy").textContent = acc + "%";
}

// 高亮当前弹到的乐谱块（短暂闪烁后自动熄灭）
function highlightSheetChip(note) {
  const chips = document.querySelectorAll(".sheet-chip");
  chips.forEach(c => {
    const nameEl = c.querySelector("div:not(.cn)");
    if (nameEl && nameEl.textContent === note) {
      c.classList.add("playing");
      setTimeout(() => c.classList.remove("playing"), 300);
    }
  });
}

// ---------- 录音流程 ----------
function startRecording() {
  recorder.start().then(() => {
    document.getElementById("recordBtn").classList.add("recording");
    document.getElementById("recordBtn").textContent = "● 录制中...";
    document.getElementById("stopRecBtn").disabled = false;
    document.getElementById("saveBtn").disabled = true;
  });
}

async function stopRecording() {
  recordedData = await recorder.stop();
  document.getElementById("recordBtn").classList.remove("recording");
  document.getElementById("recordBtn").textContent = "● 开始录音";
  document.getElementById("stopRecBtn").disabled = true;
  if (recordedData) {
    document.getElementById("playbackBtn").disabled = false;
    document.getElementById("pauseBtn").disabled = false;
    document.getElementById("saveBtn").disabled = false;
  }
}

// ---------- 后端通信 ----------
async function checkApi() {
  const statusEl = document.getElementById("apiStatus");
  if (!apiBase) { statusEl.textContent = "未连接"; statusEl.classList.remove("ok"); return; }
  try {
    const r = await fetch(apiBase + "/api/saves");
    if (r.ok) {
      statusEl.textContent = "已连接";
      statusEl.classList.add("ok");
      loadWorks();
    } else throw new Error();
  } catch {
    statusEl.textContent = "连接失败";
    statusEl.classList.remove("ok");
  }
}

async function saveWork() {
  if (!recordedData || !apiBase) return alert("请先填写后端地址并录制一段");
  const fd = new FormData();
  fd.append("audio", recordedData.audioBlob, "piano.webm");
  fd.append("meta", JSON.stringify({
    name: "我的弹奏 " + new Date().toLocaleString(),
    keys: recordedData.keys,
    duration: recordedData.duration,
    score: game.score,
    accuracy: document.getElementById("statAccuracy").textContent
  }));

  try {
    const r = await fetch(apiBase + "/api/saves", { method: "POST", body: fd });
    if (r.ok) { alert("保存成功！"); loadWorks(); }
    else alert("保存失败");
  } catch (e) { alert("保存失败：" + e.message); }
}

async function loadWorks() {
  const list = document.getElementById("worksList");
  try {
    const r = await fetch(apiBase + "/api/saves");
    const works = await r.json();
    if (!works.length) { list.innerHTML = '<p class="empty-tip">还没有作品</p>'; return; }
    list.innerHTML = "";
    works.forEach(w => {
      const card = document.createElement("div");
      card.className = "work-card";
      card.innerHTML = `
        <h4>${w.name}</h4>
        <div class="meta">${w.createdAt} · 时长 ${w.duration?.toFixed?.(1)||"-"}s</div>
        <audio controls src="${apiBase}${w.audioUrl}"></audio>
      `;
      list.appendChild(card);
    });
  } catch { /* 忽略 */ }
}

// ---------- 滚动淡入 ----------
function observeReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}
