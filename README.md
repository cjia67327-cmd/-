# PianoFlow · 在线钢琴弹奏互动平台

一个前后端分离的虚拟钢琴网页，深色音乐风，支持电脑键盘弹奏、跟弹闯关、录音回放与作品保存。

## 技术栈

- **前端**：原生 HTML + CSS + JavaScript，Web Audio API 实时合成钢琴音色（无外部音频文件）
- **后端**：Node.js + Express + Multer（接收音频上传、作品列表）

## 目录结构

```
music-piano/
├── frontend/              ← 部署到 Netlify 的静态站点
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── audio.js       # Web Audio 合成器
│       ├── sheets.js      # 内置乐谱（小星星/欢乐颂/生日快乐/致爱丽丝）
│       ├── piano.js       # 虚拟钢琴键盘
│       ├── game.js        # 跟弹闯关滚动轨道
│       ├── recorder.js    # 录音 + 按键序列
│       └── app.js         # 主逻辑
└── backend/               ← 部署到 Render / Railway 等 Node 平台
    ├── server.js
    ├── package.json
    └── recordings/        # 录音文件存放目录（自动创建）
```

## 本地运行

### 1. 启动后端

```powershell
cd backend
npm install
npm start
# 后端跑在 http://localhost:3000
```

### 2. 启动前端

前端是纯静态文件，最简单的方式：

```powershell
cd frontend
npx serve .
# 或 VS Code Live Server 打开 index.html
```

打开页面后，右上角"后端地址"填 `http://localhost:3000`，状态变为"已连接"即可保存作品。

---

## 部署说明

### 前端 → Netlify（免费）

1. 把 `frontend/` 目录整个拖到 [app.netlify.com/drop](https://app.netlify.com/drop)，或连 Git 仓库。
2. 构建命令留空，发布目录填 `frontend`。
3. 部署完成后得到一个 `https://xxx.netlify.app` 地址。

### 后端 → Render（免费）

1. 把整个 `music-piano` 仓库推到 GitHub。
2. 登录 [render.com](https://render.com) → New → Web Service。
3. 连接仓库，配置：
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18 以上
4. 部署后得到 `https://xxx.onrender.com` 地址。

### 前后端对接

打开 Netlify 上的前端页面，在右上角"后端地址"输入框填入 Render 的地址（如 `https://pianoflow-api.onrender.com`），回车保存。状态变绿即打通。

> ⚠️ Render 免费版会在 15 分钟无访问后休眠，首次请求会冷启动约 30 秒，属正常现象。

---

## 键位说明

| 键盘 | 音符         |   | 键盘 | 音符  |
| -- | ---------- | - | -- | --- |
| A  | C4 (do)    |   | W  | C♯4 |
| S  | D4 (re)    |   | E  | D♯4 |
| D  | E4 (mi)    |   | T  | F♯4 |
| F  | F4 (fa)    |   | Y  | G♯4 |
| G  | G4 (sol)   |   | U  | A♯4 |
| H  | A4 (la)    |   |    |     |
| J  | B4 (si)    |   |    |     |
| K  | C5 (高音 do) |   |    |     |

## 功能清单

- ✅ 虚拟钢琴 + 电脑键盘映射 + 按键高亮动画
- ✅ 内置 4 首乐谱，可切换并可视化
- ✅ 自由弹奏 / 跟弹闯关（音符滚动判定，错音打断连击）
- ✅ 录音（音频+按键序列）、回放、暂停、停止
- ✅ 保存作品到后端，作品列表在线播放
- ✅ 数据面板：得分 / 正确率 / 速度 / 连击
- ✅ 深色柔和 UI、浮动音符 3D 装饰、滚动淡入
- ✅ 响应式，桌面端键盘操作优先
