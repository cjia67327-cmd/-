/* ============================================================
 * audio.js —— 内置钢琴合成器（无需外部采样，打开就响）
 * 用 Web Audio API 振荡器 + ADSR 包络模拟钢琴音色
 * 接口：play(note) / stop(note) / setVolume(v) / getRecordStream()
 * ============================================================ */

// 音符名 -> 频率映射（十二平均律，A4=440Hz）
const NOTE_FREQ = (() => {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const map = {};
  // MIDI: C4 = 60, A4 = 69 = 440Hz
  for (let midi = 24; midi <= 96; midi++) {
    const name = names[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    map[name + octave] = 440 * Math.pow(2, (midi - 69) / 12);
  }
  return map;
})();

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.recordingDest = null;
    this.volume = 0.7;
    this.activeNodes = new Map(); // note -> { oscs, gain }
  }

  /** 用户第一次交互后初始化 AudioContext */
  async ensureContext() {
    if (this.ctx) return;

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    // 主音量
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);

    // 录音支路
    this.recordingDest = this.ctx.createMediaStreamDestination();
    this.masterGain.connect(this.recordingDest);

    console.log("🎹 音频引擎就绪（内置合成器模式）");
  }

  setVolume(v) {
    this.volume = v;
    if (this.masterGain) this.masterGain.gain.value = v;
  }

  getRecordStream() {
    return this.recordingDest ? this.recordingDest.stream : null;
  }

  play(noteName) {
    if (!this.ctx) return;
    if (this.activeNodes.has(noteName)) return;

    const freq = NOTE_FREQ[noteName];
    if (!freq) return;

    const now = this.ctx.currentTime;

    // 钢琴音色 = 基频 + 高八度泛音 + 快速衰减
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    // Attack：极快起音
    gain.gain.linearRampToValueAtTime(0.8, now + 0.005);
    // Decay：快速衰减到 sustain 水平
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.2);
    // Sustain：慢慢衰减
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    // 基频振荡器（三角波，偏柔和）
    const osc1 = this.ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.value = freq;

    // 泛音振荡器（正弦波，高八度，音量小）
    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.value = 0.3;

    osc1.connect(gain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    this.activeNodes.set(noteName, { osc1, osc2, gain });
  }

  stop(noteName) {
    if (!this.ctx) return;
    const nodes = this.activeNodes.get(noteName);
    if (!nodes) return;

    const now = this.ctx.currentTime;
    // Release：快速收声
    nodes.gain.gain.cancelScheduledValues(now);
    nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, now);
    nodes.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    nodes.osc1.stop(now + 0.35);
    nodes.osc2.stop(now + 0.35);
    this.activeNodes.delete(noteName);
  }
}

const audioEngine = new AudioEngine();
