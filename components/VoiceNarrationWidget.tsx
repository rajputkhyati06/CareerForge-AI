'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles } from 'lucide-react';
import { LearningLanguage } from '@/lib/topic-content-engine';

interface VoiceNarrationWidgetProps {
  textToSpeak: string;
  language: LearningLanguage;
  lessonTitle: string;
}

export const VoiceNarrationWidget: React.FC<VoiceNarrationWidgetProps> = ({
  textToSpeak,
  language,
  lessonTitle,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reset audio when lesson text changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [textToSpeak, language]);

  const cleanTextForSpeech = (rawText: string) => {
    return rawText
      .replace(/[*_#`~|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleStartOrResume = () => {
    if (!isSupported || typeof window === 'undefined') return;

    const synth = window.speechSynthesis;

    if (isPaused && utteranceRef.current) {
      synth.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synth.cancel();

    const cleanText = cleanTextForSpeech(textToSpeak);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;

    // Pick appropriate voice language tag
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'hinglish') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!isSupported || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (!isSupported || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
          <Volume2 className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">🔊 Voice Narration</span>
            <span className="text-[10px] font-semibold text-purple-300 bg-purple-950 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase">
              {language === 'hi' ? 'Hindi 🇮🇳' : language === 'hinglish' ? 'Hinglish 💬' : 'English 🇬🇧'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block -mt-0.5">
            Listen to lesson explanations aloud (Optional audio teacher)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Speed Selector */}
        <select
          value={rate}
          onChange={(e) => {
            const r = parseFloat(e.target.value);
            setRate(r);
            if (isPlaying) {
              handleStop();
            }
          }}
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-[11px] px-2 py-1 focus:outline-none focus:border-cyan-400 font-bold"
        >
          <option value={0.8}>0.8x Slow</option>
          <option value={1.0}>1.0x Normal</option>
          <option value={1.2}>1.2x Fast</option>
        </select>

        {!isPlaying && !isPaused ? (
          <button
            onClick={handleStartOrResume}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Listen</span>
          </button>
        ) : isPlaying ? (
          <>
            <button
              onClick={handlePause}
              className="bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>Pause</span>
            </button>
            <button
              onClick={handleStop}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <Square className="h-3.5 w-3.5" />
              <span>Stop</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleStartOrResume}
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <Play className="h-3.5 w-3.5 fill-emerald-300" />
              <span>Resume</span>
            </button>
            <button
              onClick={handleStop}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <Square className="h-3.5 w-3.5" />
              <span>Stop</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
