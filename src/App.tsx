/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { 
  Upload, 
  Video, 
  Scissors, 
  CheckCircle2, 
  Loader2, 
  Download, 
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  ArrowRightLeft,
  ArrowUpToLine,
  BookOpen,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateDHash, hammingDistance, formatTimestamp } from './lib/video-utils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import HowTo from './HowTo';
import { GITHUB_URL } from './lib/constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VideoFile {
  file: File;
  url: string;
  duration: number;
}

interface FrameHash {
  time: number;
  hash: bigint;
}

export default function App() {
  const [page, setPage] = useState<'home' | 'howto'>('home');
  const [video1, setVideo1] = useState<VideoFile | null>(null);
  const [video2, setVideo2] = useState<VideoFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [mergedVideoUrl, setMergedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    try {
      if (!window.crossOriginIsolated) {
        console.warn('The page is not cross-origin isolated. FFmpeg.wasm might run with degraded performance or encounter issues.');
      }

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      const ffmpeg = new FFmpeg();
      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg Log]:', message);
      });
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });
      
      console.log('Loading FFmpeg core...');
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      console.log('FFmpeg core loaded successfully');
      ffmpegRef.current = ffmpeg;
    } catch (err) {
      console.error('Failed to load FFmpeg:', err);
      setError(`Failed to load video processing engine: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      const videoData = { file, url, duration: video.duration };
      if (index === 1) setVideo1(videoData);
      else setVideo2(videoData);
    };
  };

  const handleSwap = () => {
    setVideo1(video2);
    setVideo2(video1);
  };

  const handleUseMerged = async (target: 1 | 2) => {
    if (!mergedVideoUrl) return;
    try {
      const response = await fetch(mergedVideoUrl);
      const blob = await response.blob();
      const file = new File([blob], `merged_clip_${Date.now()}.mp4`, { type: 'video/mp4' });
      const url = URL.createObjectURL(file);
      
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        const videoData = { file, url, duration: video.duration };
        if (target === 1) {
          setVideo1(videoData);
        } else {
          setVideo2(videoData);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    } catch (err) {
      console.error('Failed to use merged video:', err);
      setError('Failed to load merged video as input.');
    }
  };

  const extractFrames = async (
    video: HTMLVideoElement, 
    startTime: number, 
    endTime: number, 
    fps: number = 30
  ): Promise<FrameHash[]> => {
    const hashes: FrameHash[] = [];
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    
    canvas.width = 9;
    canvas.height = 8;

    const step = 1 / fps;
    for (let t = startTime; t <= endTime; t += step) {
      video.currentTime = t;
      await new Promise((resolve) => {
        video.onseeked = resolve;
      });
      ctx.drawImage(video, 0, 0, 9, 8);
      const imageData = ctx.getImageData(0, 0, 9, 8);
      hashes.push({ time: t, hash: calculateDHash(imageData) });
    }
    return hashes;
  };

  const [matchInfo, setMatchInfo] = useState<{ t1: number, t2: number, distance: number } | null>(null);

  const mergeVideos = async () => {
    if (!video1 || !video2 || !ffmpegRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setMergedVideoUrl(null);
    setMatchInfo(null);

    try {
      const ffmpeg = ffmpegRef.current;

      // 1. Define search windows
      setStatus('Analyzing transition points...');
      const v1Start = Math.max(0, video1.duration - 2);
      const v1End = video1.duration;
      const v2Start = 0;
      const v2End = Math.min(2, video2.duration);

      // 2. Extract and hash frames
      const hashes1 = await extractFrames(videoRef1.current!, v1Start, v1End);
      const hashes2 = await extractFrames(videoRef2.current!, v2Start, v2End);

      // 3. Compare hashes
      let minDistance = Infinity;
      let bestPair = { t1: video1.duration, t2: 0 };

      for (const h1 of hashes1) {
        for (const h2 of hashes2) {
          const dist = hammingDistance(h1.hash, h2.hash);
          if (dist < minDistance) {
            minDistance = dist;
            bestPair = { t1: h1.time, t2: h2.time };
          }
        }
      }

      setMatchInfo({ ...bestPair, distance: minDistance });
      console.log('Best match found at:', bestPair, 'Distance:', minDistance);
      setStatus('Processing video clips...');

      // 4. Trim and Merge using FFmpeg
      await ffmpeg.writeFile('input1.mp4', await fetchFile(video1.file));
      await ffmpeg.writeFile('input2.mp4', await fetchFile(video2.file));

      // Trim Clip 1: from start to t1
      setStatus('Trimming first clip (frame-accurate)...');
      await ffmpeg.exec([
        '-i', 'input1.mp4',
        '-t', bestPair.t1.toString(),
        'trimmed1.mp4'
      ]);

      // Trim Clip 2: from t2 to end
      // Add a small offset (~1 frame at 30fps) to skip the duplicate matched frame
      const t2Adjusted = bestPair.t2 + 0.033;
      setStatus('Trimming second clip (frame-accurate)...');
      await ffmpeg.exec([
        '-ss', t2Adjusted.toString(),
        '-i', 'input2.mp4',
        'trimmed2.mp4'
      ]);

      // Concatenate
      setStatus('Merging clips...');
      await ffmpeg.writeFile('concat.txt', `file 'trimmed1.mp4'\nfile 'trimmed2.mp4'`);
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-c', 'copy',
        'output.mp4'
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
      setMergedVideoUrl(url);
      setStatus('Done!');
    } catch (err) {
      console.error('Processing error:', err);
      setError('An error occurred during video processing. This might be due to incompatible video formats or browser limitations.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (page === 'howto') {
    return <HowTo onBack={() => setPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* GitHub Link */}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/40 hover:text-white/70"
        title="View on GitHub"
      >
        <Github className="w-5 h-5" />
      </a>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <RefreshCw className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-white/60">AI Video Utility</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            GlideBlend
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-xl mx-auto text-lg mb-6"
          >
            Join AI-generated clips with pixel-perfect transitions using perceptual hashing analysis.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setPage('howto')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/50 transition-colors text-sm font-medium text-white/70 hover:text-white"
            >
              <BookOpen className="w-4 h-4" />
              How To / User Guide
            </button>
          </motion.div>
        </header>

        {/* Upload Section */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Swap Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex">
            <button 
              onClick={handleSwap}
              disabled={isProcessing}
              className="p-3 rounded-full bg-[#0a0a0a] border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
              title="Swap clips"
            >
              <ArrowRightLeft className="w-5 h-5 text-white/60 group-hover:text-orange-500 transition-colors" />
            </button>
          </div>
          
          {[1, 2].map((idx) => {
            const video = idx === 1 ? video1 : video2;
            const videoRef = idx === 1 ? videoRef1 : videoRef2;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="group relative aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-orange-500/50 transition-colors"
              >
                {!video ? (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                      <Upload className="w-6 h-6 text-white/60 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-white/60">Upload Clip {idx}</span>
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, idx as 1 | 2)} 
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-full">
                    <video 
                      ref={videoRef}
                      src={video.url} 
                      className="w-full h-full object-cover"
                      controls
                    />
                    <button 
                      onClick={() => idx === 1 ? setVideo1(null) : setVideo2(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/60">
                      {formatTimestamp(video.duration)}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-6">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={!video1 || !video2 || isProcessing}
            onClick={mergeVideos}
            className={cn(
              "relative group px-12 py-4 rounded-full font-bold text-lg transition-all overflow-hidden",
              (!video1 || !video2 || isProcessing) 
                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                : "bg-orange-500 text-black hover:scale-105 active:scale-95"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {status}
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5" />
                  GlideBlend
                </>
              )}
            </span>
            {!isProcessing && video1 && video2 && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>

          {isProcessing && (
            <div className="w-full max-w-md">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Processing {progress}%
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <AnimatePresence>
          {mergedVideoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-24"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Merged Output</h2>
                  {matchInfo && (
                    <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                      <span>Match: {matchInfo.distance} bits</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span>Trim 1: {formatTimestamp(matchInfo.t1)}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span>Trim 2: {formatTimestamp(matchInfo.t2)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                    <button
                      onClick={() => handleUseMerged(1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-xs font-medium text-white/80"
                      title="Use this result as Clip 1 for the next merge"
                    >
                      <ArrowUpToLine className="w-3.5 h-3.5" />
                      Use as Clip 1
                    </button>
                    <div className="w-px bg-white/10 my-2 mx-1" />
                    <button
                      onClick={() => handleUseMerged(2)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-xs font-medium text-white/80"
                      title="Use this result as Clip 2 for the next merge"
                    >
                      <ArrowUpToLine className="w-3.5 h-3.5" />
                      Use as Clip 2
                    </button>
                  </div>
                  <a 
                    href={mergedVideoUrl} 
                    download="glideblend.mp4"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-black hover:bg-orange-400 transition-colors text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
              <div className="aspect-video rounded-3xl bg-white/5 border border-white/10 overflow-hidden shadow-2xl shadow-orange-500/5">
                <video 
                  src={mergedVideoUrl} 
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Hidden Canvas for frame extraction */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Footer */}
      <footer className="mt-24 pb-12 text-center border-t border-white/5 pt-12">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Algorithm</span>
            <span className="text-xs font-medium text-white/60">dHash (64-bit)</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Engine</span>
            <span className="text-xs font-medium text-white/60">FFmpeg.wasm</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Window</span>
            <span className="text-xs font-medium text-white/60">2.0s Search</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
