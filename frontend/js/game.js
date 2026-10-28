/* ============================================================
 * game.js —— 跟弹闯关模式
 * 原理：把乐谱按 BPM 展开成"每个音符应弹奏的绝对时间点"，
 *       音符从右侧滚入，到达判定线时玩家按键即算命中。
 * ============================================================ */

class Game {
  constructor(opts) {
    this.trackEl = document.getElementById("trackNotes");
    this.lineEl = document.querySelector(".track-line");
    this.onScore = opts.onScore;       // 回调(score, combo, accuracy, speed)
    this.onEnd = opts.onEnd;

    this.running = false;
    this.rafId = null;
    this.startTime = 0;
    this.notes = [];        // 展开后的音符 {note, time, el, state}
    this.leadTime = 3;      // 提前 3 秒出现
    this.tolerance = 0.25;  // 命中容差 ±250ms
    this.score = 0;
    this.combo = 0;
    this.hitCount = 0;
    this.totalCount = 0;
  }

  /** 根据乐谱和BPM展开音符时间轴 */
  loadSheet(sheet, bpm) {
    this.notes = [];
    let t = 0.5; // 开头留 0.5 秒准备
    const beatSec = 60 / bpm;
    sheet.notes.forEach(n => {
      this.notes.push({
        note: n.note,
        time: t,
        el: null,
        state: "waiting" // waiting | hit | miss
      });
      t += n.beats * beatSec;
    });
    this.totalCount = this.notes.length;
    this.totalDuration = t;
  }

  start() {
    if (!this.notes.length) return;
    this.running = true;
    this.score = 0; this.combo = 0; this.hitCount = 0;
    this.trackEl.innerHTML = "";
    // 为每个音符建一个 DOM
    this.notes.forEach(n => {
      const div = document.createElement("div");
      div.className = "falling-note";
      div.textContent = n.note;
      this.trackEl.appendChild(div);
      n.el = div;
    });
    this.startTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.trackEl.innerHTML = "";
  }

  loop() {
    if (!this.running) return;
    const elapsed = (performance.now() - this.startTime) / 1000;
    const trackW = this.trackEl.clientWidth;
    const judgeX = trackW * 0.15; // 判定线位置(px)

    this.notes.forEach(n => {
      // 音符应在 (n.time - leadTime) 出现，n.time 到达判定线
      const appear = n.time - this.leadTime;
      const disappear = n.time + 0.5;
      if (elapsed < appear || elapsed > disappear) {
        n.el.style.display = "none";
        return;
      }
      n.el.style.display = "block";
      // 从右边缘(100%)移动到判定线(15%)
      const progress = (elapsed - appear) / this.leadTime; // 0~1
      const x = trackW * (1 - progress * (1 - 0.15));
      n.el.style.left = x + "px";

      // 超过时间未命中 -> miss
      if (n.state === "waiting" && elapsed > n.time + this.tolerance) {
        n.state = "miss";
        n.el.classList.add("miss");
        this.combo = 0;
        this.emit();
      }
    });

    // 全部结束
    if (elapsed > this.totalDuration + 1) {
      this.stop();
      if (this.onEnd) this.onEnd();
      return;
    }
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  /** 玩家在自由/游戏模式下按下了某个键，由 app.js 调用 */
  onKeyDown(note) {
    if (!this.running) return;
    const elapsed = (performance.now() - this.startTime) / 1000;
    // 找最近的待命中音符
    let best = null, bestDiff = Infinity;
    this.notes.forEach(n => {
      if (n.state !== "waiting" || n.note !== note) return;
      const d = Math.abs(n.time - elapsed);
      if (d < bestDiff) { bestDiff = d; best = n; }
    });
    if (best && bestDiff <= this.tolerance) {
      best.state = "hit";
      best.el.classList.add("hit");
      this.hitCount++;
      this.combo++;
      this.score += 100 + Math.min(this.combo, 10) * 5;
    } else {
      // 按错音：打断连击
      this.combo = 0;
    }
    this.emit();
  }

  emit() {
    const acc = this.totalCount ? Math.round(this.hitCount / this.totalCount * 100) : 0;
    if (this.onScore) this.onScore(this.score, this.combo, acc);
  }
}
