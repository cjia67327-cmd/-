/* ============================================================
 * recorder.js —— 录制弹奏音频 + 按键序列
 * 音频：MediaRecorder 捕获 Web Audio 输出流
 * 按键：记录 {note, t(秒,相对开始), type:down/up}
 * ============================================================ */

class Recorder {
  constructor() {
    this.mediaRec = null;
    this.chunks = [];
    this.keyEvents = [];
    this.startTs = 0;
    this.state = "idle"; // idle | recording | paused | stopped
    this.playbackTimers = [];
  }

  async start() {
    await audioEngine.ensureContext();
    const stream = audioEngine.getRecordStream();
    this.chunks = [];
    this.keyEvents = [];
    this.startTs = performance.now();
    this.state = "recording";

    this.mediaRec = new MediaRecorder(stream);
    this.mediaRec.ondataavailable = e => { if (e.data.size) this.chunks.push(e.data); };
    this.mediaRec.start();
  }

  /** 记录一次按键（由 app.js 转发） */
  logKey(note, type) {
    if (this.state !== "recording") return;
    this.keyEvents.push({
      note, type,
      t: (performance.now() - this.startTs) / 1000
    });
  }

  pause()  { if (this.mediaRec?.state === "recording") this.mediaRec.pause(); this.state = "paused"; }
  resume() { if (this.mediaRec?.state === "paused")    this.mediaRec.resume(); this.state = "recording"; }

  stop() {
    return new Promise(resolve => {
      if (!this.mediaRec || this.state === "idle") return resolve(null);
      this.mediaRec.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mediaRec.mimeType || "audio/webm" });
        this.state = "idle";
        resolve({ audioBlob: blob, keys: this.keyEvents, duration: (performance.now() - this.startTs)/1000 });
      };
      this.mediaRec.stop();
    });
  }

  /** 回放：播放音频 + 按时间戳触发按键高亮 */
  playback(audioBlob, keys, piano) {
    this.stopPlayback();
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    audio.play();
    keys.forEach(k => {
      const timer = setTimeout(() => {
        if (k.type === "down")  piano.press(k.note);
        else                    piano.release(k.note);
      }, k.t * 1000);
      this.playbackTimers.push(timer);
    });
    audio.onended = () => { URL.revokeObjectURL(url); piano.releaseAll(); };
    this._currentAudio = audio;
  }

  pausePlayback() { this._currentAudio?.pause(); this.playbackTimers.forEach(clearTimeout); this.playbackTimers = []; }
  stopPlayback()  { this._currentAudio?.pause(); this._currentAudio = null; this.playbackTimers.forEach(clearTimeout); this.playbackTimers = []; }
}
