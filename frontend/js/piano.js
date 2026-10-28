/* ============================================================
 * piano.js —— 虚拟钢琴键盘
 * 布局：C4 ~ C5 共一个八度 + 高音 C
 *   白键(8个)：C4 D4 E4 F4 G4 A4 B4 C5  -> 键盘 A S D F G H J K
 *   黑键(5个)：C#4 D#4 F#4 G#4 A#4       -> 键盘 W E T Y U
 * ============================================================ */

// 键位配置：从左到右依次排列，isBlack 表示黑键
const KEY_LAYOUT = [
  { note: "C4",  kbd: "A", isBlack: false },
  { note: "C#4", kbd: "W", isBlack: true  },
  { note: "D4",  kbd: "S", isBlack: false },
  { note: "D#4", kbd: "E", isBlack: true  },
  { note: "E4",  kbd: "D", isBlack: false },
  { note: "F4",  kbd: "F", isBlack: false },
  { note: "F#4", kbd: "T", isBlack: true  },
  { note: "G4",  kbd: "G", isBlack: false },
  { note: "G#4", kbd: "Y", isBlack: true  },
  { note: "A4",  kbd: "H", isBlack: false },
  { note: "A#4", kbd: "U", isBlack: true  },
  { note: "B4",  kbd: "J", isBlack: false },
  { note: "C5",  kbd: "K", isBlack: false },
];

// 键盘字母 -> 音符名 的反查表
const KBD_TO_NOTE = {};
KEY_LAYOUT.forEach(k => KBD_TO_NOTE[k.kbd.toLowerCase()] = k.note);

class Piano {
  constructor(containerSel) {
    this.el = document.querySelector(containerSel);
    this.onNoteOn = null;   // 回调：玩家按下某键
    this.onNoteOff = null;
    this.downKeys = new Set();
    this.render();
    this.bindEvents();
  }

  render() {
    this.el.innerHTML = "";
    KEY_LAYOUT.forEach(cfg => {
      const div = document.createElement("div");
      div.className = `key ${cfg.isBlack ? "black" : "white"}`;
      div.dataset.note = cfg.note;
      div.innerHTML = `<span>${cfg.note.replace("#", "♯")}</span><span class="kbd">${cfg.kbd}</span>`;
      this.el.appendChild(div);
    });
  }

  bindEvents() {
    // 鼠标 / 触屏
    this.el.addEventListener("mousedown", e => {
      const key = e.target.closest(".key");
      if (key) this.press(key.dataset.note);
    });
    ["mouseup", "mouseleave"].forEach(ev =>
      this.el.addEventListener(ev, () => this.releaseAll())
    );

    // 物理键盘
    window.addEventListener("keydown", e => {
      if (e.repeat) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      const note = KBD_TO_NOTE[e.key.toLowerCase()];
      if (note) this.press(note);
    });
    window.addEventListener("keyup", e => {
      const note = KBD_TO_NOTE[e.key.toLowerCase()];
      if (note) this.release(note);
    });
  }

  press(note) {
    if (this.downKeys.has(note)) return;
    this.downKeys.add(note);
    const el = this.el.querySelector(`.key[data-note="${note}"]`);
    if (el) el.classList.add("active");
    audioEngine.play(note);
    if (this.onNoteOn) this.onNoteOn(note);
  }

  release(note) {
    if (!this.downKeys.has(note)) return;
    this.downKeys.delete(note);
    const el = this.el.querySelector(`.key[data-note="${note}"]`);
    if (el) el.classList.remove("active");
    audioEngine.stop(note);
    if (this.onNoteOff) this.onNoteOff(note);
  }

  releaseAll() {
    [...this.downKeys].forEach(n => this.release(n));
  }

  // 跟弹模式下由外部触发高亮（不发声，仅视觉提示）
  flashNote(note, hit) {
    const el = this.el.querySelector(`.key[data-note="${note}"]`);
    if (!el) return;
    el.classList.add("active");
    setTimeout(() => el.classList.remove("active"), 200);
  }
}
