<div align="center">

<h1>GlideBlend</h1>

<p><strong>Join AI-generated video clips with pixel-perfect transitions — entirely in the browser.</strong></p>

&nbsp;
<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
&nbsp;
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
&nbsp;
<img src="https://img.shields.io/badge/FFmpeg.wasm-0.12-007808?logo=ffmpeg&logoColor=white" alt="FFmpeg.wasm" />

</div>

---

## Overview

GlideBlend is a browser-based video merging tool that intelligently stitches two video clips together at their most visually similar frames. Instead of a hard cut at an arbitrary timestamp, it uses **perceptual hashing (dHash)** to scan the transition zone of each clip, finds the pair of frames with the lowest Hamming distance, and uses **FFmpeg.wasm** to trim and concatenate the clips entirely client-side — no server upload required.

It was built for merging AI-generated videos (e.g., multiple Sora or Veo 2 clips) into one seamless sequence, but works with any video content.

---

## Features

- 🎬 **Seamless merging** — finds the best matching frame between two clips using 64-bit dHash + Hamming distance
- ⚡ **Fully client-side** — all processing runs in the browser via FFmpeg.wasm (no file upload to a server)
- 🔗 **Chaining support** — use the merged output directly as Clip 1 or Clip 2 for the next merge
- 🔀 **Swap clips** — quickly swap the order of the two input clips
- 📊 **Real-time progress** — live progress bar and status messages during processing
- 💾 **Download as MP4** — one-click download of the merged video
- 🌑 **Dark UI** — polished dark-mode interface with animated transitions

---

## How It Works

1. **Frame extraction** — the last 2 seconds of Clip 1 and the first 2 seconds of Clip 2 are sampled at 30 fps using an offscreen `<canvas>`.
2. **dHash** — each frame is downscaled to a 9×8 greyscale image and converted to a 64-bit difference hash.
3. **Best match** — every hash from Clip 1 is compared against every hash from Clip 2 using Hamming distance. The pair with the smallest distance is selected as the cut point.
4. **FFmpeg trim & concat** — Clip 1 is trimmed to the cut point; Clip 2 is trimmed from its cut point to the end; the two trimmed clips are concatenated with stream copy (no re-encode).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | [React 19](https://react.dev) + [TypeScript 5.8](https://www.typescriptlang.org) |
| Build | [Vite 6](https://vite.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Video processing | [FFmpeg.wasm 0.12](https://ffmpegwasm.netlify.app) |
| Animations | [Motion/React 12](https://motion.dev) |
| Icons | [Lucide React](https://lucide.dev) |
| Dev server | [Express 4](https://expressjs.com) (with COOP/COEP headers for `SharedArrayBuffer`) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or later recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Kajdep/GlideBlend.git
cd GlideBlend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The app requires cross-origin isolation (`COOP`/`COEP` headers) for FFmpeg.wasm to use `SharedArrayBuffer`. The included Express dev server sets these headers automatically.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Express + Vite development server |
| `npm run build` | Build the app for production (`dist/`) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove the `dist/` directory |

---

## Usage

1. **Upload Clip 1** — click the first panel and select your first video file.
2. **Upload Clip 2** — click the second panel and select the video you want to append.
3. *(Optional)* **Swap** clips using the ⇄ button between the panels.
4. Click **Merge Seamlessly** and wait for processing to complete.
5. Preview the merged result, inspect the match metadata (Hamming distance, trim points), and click **Download** to save it as `glideblend.mp4`.
6. *(Optional)* Click **Use as Clip 1** or **Use as Clip 2** to chain the merged output into the next merge.

---

## Project Structure

```
GlideBlend/
├── src/
│   ├── App.tsx           # Main React component (UI + merge logic)
│   ├── main.tsx          # React entry point
│   ├── index.css         # Global styles (Tailwind)
│   └── lib/
│       └── video-utils.ts  # dHash, Hamming distance, timestamp formatting
├── server.ts             # Express dev server (COOP/COEP headers + Vite middleware)
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variable template
└── metadata.json         # App metadata
```

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## License

Licensed under the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Kajdep">Kajdep</a></sub>
</div>
