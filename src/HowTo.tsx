/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, BookOpen, Image } from 'lucide-react';
import { motion } from 'motion/react';
import { WEBSITE_URL } from './lib/constants';

interface HowToProps {
  onBack: () => void;
}

export default function HowTo({ onBack }: HowToProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>


      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/50 transition-colors text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to GlideBlend
        </motion.button>

        {/* Header */}
        <header className="mb-14 text-center">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            src="/glideblend-mark.svg"
            alt="GlideBlend brand mark"
            className="mx-auto mb-6 h-14 w-14"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <BookOpen className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-white/60">User Guide</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            How To Use GlideBlend
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-xl mx-auto text-lg"
          >
            Everything you need to know to create seamless AI video transitions.
          </motion.p>
        </header>

        {/* Step-by-Step Visual Guide */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Image className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Step-by-Step Guide</h2>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <img
              src="/clipguide.jpeg"
              alt="GlideBlend step-by-step how-to guide"
              className="w-full h-auto"
            />
          </div>
        </motion.section>

        {/* AI Video Merging Process Infographic */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Image className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">AI Video Merging Process</h2>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <img
              src="/ai-video-merging-process-infographic.jpg"
              alt="AI Video Merging Process Infographic"
              className="w-full h-auto"
            />
          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="pb-12 text-center border-t border-white/5 pt-12">
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
        <a
          href={WEBSITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/45 transition-colors hover:border-orange-500/40 hover:text-white"
        >
          glideblend.com
        </a>
      </footer>
    </div>
  );
}

