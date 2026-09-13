import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, Sparkles, GraduationCap, Award, Terminal, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData, VideoShowcase } from '../types';
import { speakText, stopSpeech } from '../utils/voice';

interface VideoSectionProps {
  showcase: VideoShowcase;
  data: PortfolioData;
}

interface Chapter {
  index: number;
  startTime: number;
  endTime: number;
  duration: number;
  label: string;
  speechText: string;
}

const CHAPTERS: Chapter[] = [
  {
    index: 0,
    startTime: 0,
    endTime: 8,
    duration: 8,
    label: '01 Identity & Distinction',
    speechText: 'Hello! I am Soumadip Das, an Information Technology engineering scholar at Haldia Institute of Technology, Tejas India Hackathon Winner, and researcher.'
  },
  {
    index: 1,
    startTime: 8,
    endTime: 16,
    duration: 8,
    label: '02 Academic Excellence',
    speechText: 'Academic distinction: maintaining a 9.16 CGPA at Haldia Institute of Technology, with 93% and 92% marks in Higher Secondary and Secondary boards.'
  },
  {
    index: 2,
    startTime: 16,
    endTime: 25,
    duration: 9,
    label: '03 Tejas India Hackathon',
    speechText: 'Tejas India Hackathon Winner and Team Lead: I engineered our real-time UPI Fraud Monitoring system with Python, SQL databases, and anomalous pattern detection.'
  },
  {
    index: 3,
    startTime: 25,
    endTime: 33,
    duration: 8,
    label: '04 Experience & Research',
    speechText: 'Professional roles: Research Assistant at NSRI, freelance full-stack engineer at micro1, and AI specialist at Handshake and Outlier AI.'
  },
  {
    index: 4,
    startTime: 33,
    endTime: 40,
    duration: 7,
    label: '05 Stack & Let’s Connect',
    speechText: 'Specialized in Python, SQL, Generative AI, and Power BI. Reach out directly at soumadipd43@gmail.com, or download my resume.'
  }
];

const TOTAL_DURATION = 40;

export const VideoSection: React.FC<VideoSectionProps> = ({ showcase, data }) => {
  const isInteractiveMode = showcase.mode !== 'custom';
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const rawVideoRef = useRef<HTMLVideoElement>(null);
  const activeChapterRef = useRef<number>(0);
  const chapterStartTimestampRef = useRef<number>(Date.now());

  // Determine active chapter by timestamp
  const getChapterIndexFromTime = useCallback((time: number): number => {
    for (const ch of CHAPTERS) {
      if (time >= ch.startTime && time < ch.endTime) {
        return ch.index;
      }
    }
    return CHAPTERS.length - 1;
  }, []);

  const activeScene = getChapterIndexFromTime(currentTime);

  // Synchronized playback executor for each chapter
  const playChapter = useCallback((chIndex: number, startOffsetWithinChapter = 0) => {
    if (chIndex >= CHAPTERS.length) {
      setIsPlaying(false);
      setCurrentTime(TOTAL_DURATION);
      stopSpeech();
      return;
    }

    activeChapterRef.current = chIndex;
    const currentCh = CHAPTERS[chIndex];
    chapterStartTimestampRef.current = Date.now() - (startOffsetWithinChapter * 1000) / playbackSpeed;
    setCurrentTime(currentCh.startTime + startOffsetWithinChapter);

    stopSpeech();

    if (!isVoiceMuted && isInteractiveMode) {
      speakText(
        currentCh.speechText,
        0.96 * playbackSpeed,
        0.92,
        // onEnd callback: immediately and smoothly progress to next chapter
        () => {
          if (activeChapterRef.current === chIndex) {
            if (chIndex < CHAPTERS.length - 1) {
              playChapter(chIndex + 1, 0);
            } else {
              setIsPlaying(false);
              setCurrentTime(TOTAL_DURATION);
            }
          }
        },
        // onError callback
        (err) => {
          console.warn('Voice narration notice:', err);
        },
        // onBoundary callback: word boundary sync for accurate timeline tracking
        (charIndex, totalChars) => {
          if (activeChapterRef.current === chIndex && totalChars > 0) {
            const fraction = Math.min(Math.max(charIndex / totalChars, 0), 1);
            const syncedTime = currentCh.startTime + fraction * currentCh.duration;
            setCurrentTime(syncedTime);
          }
        }
      );
    }
  }, [isVoiceMuted, isInteractiveMode, playbackSpeed]);

  // High precision animation frame timer loop
  useEffect(() => {
    if (!isPlaying || !isInteractiveMode) return;

    let animationFrameId: number;

    const tick = () => {
      const chIndex = activeChapterRef.current;
      const ch = CHAPTERS[chIndex];
      if (!ch) return;

      const elapsedSec = ((Date.now() - chapterStartTimestampRef.current) / 1000) * playbackSpeed;

      if (isVoiceMuted) {
        // Clock-driven chapter progression when voice is muted
        if (elapsedSec >= ch.duration) {
          if (chIndex < CHAPTERS.length - 1) {
            playChapter(chIndex + 1, 0);
          } else {
            setIsPlaying(false);
            setCurrentTime(TOTAL_DURATION);
            return;
          }
        } else {
          setCurrentTime(ch.startTime + elapsedSec);
        }
      } else {
        // Soft forward progression capped to chapter boundary while voice narration is active
        const progressTarget = ch.startTime + Math.min(elapsedSec, ch.duration - 0.05);
        setCurrentTime((prev) => Math.max(prev, progressTarget));
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isVoiceMuted, isInteractiveMode, playbackSpeed, playChapter]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
      if (rawVideoRef.current) rawVideoRef.current.pause();
    } else {
      setIsPlaying(true);
      if (isInteractiveMode) {
        let chIdx = getChapterIndexFromTime(currentTime);
        if (currentTime >= TOTAL_DURATION - 0.2) {
          chIdx = 0;
          setCurrentTime(0);
        }
        const offset = Math.max(0, currentTime - CHAPTERS[chIdx].startTime);
        playChapter(chIdx, offset);
      } else {
        if (rawVideoRef.current) {
          rawVideoRef.current.play().catch((e) => console.warn('Video play error', e));
        }
      }
    }
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(time, TOTAL_DURATION));
    setCurrentTime(clamped);
    const chIdx = getChapterIndexFromTime(clamped);
    const offset = Math.max(0, clamped - CHAPTERS[chIdx].startTime);

    if (isPlaying) {
      stopSpeech();
      playChapter(chIdx, offset);
    } else {
      activeChapterRef.current = chIdx;
      stopSpeech();
    }
  };

  const handleReset = () => {
    stopSpeech();
    setCurrentTime(0);
    activeChapterRef.current = 0;
    if (isPlaying) {
      playChapter(0, 0);
    }
  };

  const toggleMute = () => {
    if (!isVoiceMuted) {
      stopSpeech();
      setIsVoiceMuted(true);
    } else {
      setIsVoiceMuted(false);
      if (isPlaying && isInteractiveMode) {
        const chIdx = getChapterIndexFromTime(currentTime);
        const offset = Math.max(0, currentTime - CHAPTERS[chIdx].startTime);
        playChapter(chIdx, offset);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
    }
  };

  return (
    <section id="video-reel" className="py-20 px-4 sm:px-6 bg-stone-100/70 border-t border-stone-200/80">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-8">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>Interactive Profile Showreel</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-2">
            {showcase.title || 'Profile Video & Work in Motion'}
          </h2>
          <p className="text-sm text-stone-600 mt-1.5 max-w-xl">
            {showcase.subtitle || 'Synchronized presentation highlighting hackathon victory, academic records, and research.'}
          </p>
        </div>

        {/* Video Screen Container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-stone-950 shadow-2xl border border-stone-800"
        >
          {/* Main Video Viewport (16:9) */}
          <div className="relative aspect-video w-full overflow-hidden bg-radial from-stone-900 to-black select-none">
            
            {/* If External Raw Video Mode is selected */}
            {!isInteractiveMode ? (
              <video
                ref={rawVideoRef}
                src={showcase.videoUrl}
                poster={showcase.posterUrl || data.avatarUrl}
                playsInline
                className="w-full h-full object-cover"
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              /* Custom Interactive Profile Video Scenes */
              <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10 text-white overflow-hidden">
                
                {/* Background ambient lighting effects */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-600/30 blur-[100px] rounded-full animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-600/20 blur-[100px] rounded-full" />
                </div>

                {/* Subtitle / Chapter indicator on top-left */}
                <div className="absolute top-4 left-5 flex items-center gap-2 z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300/90 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
                    {CHAPTERS[activeScene]?.label}
                  </span>
                </div>

                {/* SCENE 0: Identity & Introduction */}
                {activeScene === 0 && (
                  <motion.div
                    key="scene-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 max-w-3xl z-10"
                  >
                    <div className="relative shrink-0">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 shadow-2xl overflow-hidden">
                        <img
                          src={data.avatarUrl}
                          alt={data.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/profile.jpg';
                          }}
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-amber-400 text-stone-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        WINNER 🏆
                      </span>
                    </div>

                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-xs font-mono font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Official Portfolio Showreel</span>
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                        {data.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed">
                        Information Technology scholar at Haldia Institute of Technology, Tejas India Hackathon Winner, and Research Assistant at NSRI.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-[11px] font-mono text-emerald-300">
                          ★ 9.16 CGPA
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-600/50 text-[11px] font-mono text-amber-300">
                          Tejas India Hackathon Winner 🏆
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 1: Academic Excellence & Haldia Record */}
                {activeScene === 1 && (
                  <motion.div
                    key="scene-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl w-full z-10 text-center sm:text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                        <GraduationCap className="w-4 h-4" />
                        <span>Academic Distinction Records</span>
                      </div>
                      <span className="text-[11px] font-mono text-stone-400">Consistent Top Rank</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-4 rounded-2xl bg-stone-900/80 border border-emerald-500/40 shadow-lg flex flex-col justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 block">9.16</span>
                          <span className="text-xs font-bold text-white mt-1 block">B.Tech IT</span>
                          <span className="text-[11px] text-stone-400">Haldia Inst. of Tech</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 mt-2 bg-emerald-950/60 py-0.5 px-1.5 rounded self-start">
                          1st Yr: 9.15 | 2nd Yr: 9.16
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-700 shadow-lg flex flex-col justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">93%</span>
                          <span className="text-xs font-bold text-white mt-1 block">Higher Secondary (XII)</span>
                          <span className="text-[11px] text-stone-400">Science Stream Distinction</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-300 mt-2 bg-stone-800 py-0.5 px-1.5 rounded self-start">
                          WBCHSE Board
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-700 shadow-lg flex flex-col justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">92%</span>
                          <span className="text-xs font-bold text-white mt-1 block">Secondary (Class X)</span>
                          <span className="text-[11px] text-stone-400">High Academic Distinction</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-300 mt-2 bg-stone-800 py-0.5 px-1.5 rounded self-start">
                          WBBSE Board
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 2: Flagship Project — Tejas India Hackathon Winner */}
                {activeScene === 2 && (
                  <motion.div
                    key="scene-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl w-full z-10"
                  >
                    <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/90 border border-emerald-500/50 shadow-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          Tejas India Hackathon Winner & Team Lead 🏆
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">Flagship AI & Security</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                        UPI Fraud Detection & Prevention System (SecureFlow AI)
                      </h4>

                      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                        Real-time transaction monitoring platform built with Python and SQLite/SQL. Analyzes anomalous patterns, velocity spikes, and fraud alerts across live web dashboards.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-stone-800/80 border border-stone-700">
                          <span className="font-mono text-emerald-400 font-bold block">&lt; 85ms</span>
                          <span className="text-[10px] text-stone-400">Inference Latency</span>
                        </div>
                        <div className="p-2 rounded-xl bg-stone-800/80 border border-stone-700">
                          <span className="font-mono text-emerald-400 font-bold block">Python + SQL</span>
                          <span className="text-[10px] text-stone-400">Engine Backend</span>
                        </div>
                        <div className="p-2 rounded-xl bg-stone-800/80 border border-stone-700">
                          <span className="font-mono text-emerald-400 font-bold block">FastAPI</span>
                          <span className="text-[10px] text-stone-400">Microservice Stack</span>
                        </div>
                        <div className="p-2 rounded-xl bg-stone-800/80 border border-stone-700">
                          <span className="font-mono text-emerald-400 font-bold block">Telemetry</span>
                          <span className="text-[10px] text-stone-400">Fraud Dashboards</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 3: Experience & Research */}
                {activeScene === 3 && (
                  <motion.div
                    key="scene-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl w-full z-10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                        <Award className="w-4 h-4" />
                        <span>Professional Roles & Industry Impact</span>
                      </div>
                      <span className="text-[11px] font-mono text-stone-400">11 Career Experiences</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-stone-900/85 border border-stone-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          RI
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Research Assistant @ NSRI</h5>
                          <p className="text-[11px] text-stone-400 mt-0.5">Applied computing, documentation & algorithmic problem solving.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-900/85 border border-stone-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          M1
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Full Stack Engineer @ micro1</h5>
                          <p className="text-[11px] text-stone-400 mt-0.5">Freelance engineering delivering performant architectures.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-900/85 border border-stone-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          HS
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">AI Data Trainer @ Handshake</h5>
                          <p className="text-[11px] text-stone-400 mt-0.5">Model evaluation, prompt refinement & certification standards.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-900/85 border border-stone-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          OA
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">AI Specialist @ Outlier AI</h5>
                          <p className="text-[11px] text-stone-400 mt-0.5">Reinforcement learning (RLHF) and reasoning alignment.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 4: Technical Stack & Contact Callout */}
                {activeScene === 4 && (
                  <motion.div
                    key="scene-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl w-full z-10 text-center space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Ready for Impactful Engineering Roles</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Let's Innovate Together
                    </h3>

                    <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                      {['Python', 'SQL / SQLite', 'Java', 'C/C++', 'Generative AI', 'Power BI', 'FastAPI', 'DSA'].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-stone-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 flex flex-wrap justify-center items-center gap-3">
                      <a
                        href={`mailto:${data.email}`}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
                      >
                        Email: {data.email}
                      </a>
                      <a
                        href={data.social.linkedin || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs border border-stone-600 transition-colors"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Play/Pause Center Overlay Button when Paused */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-stone-950/40 backdrop-blur-[2px] cursor-pointer z-30"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-white/30 opacity-75" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 text-emerald-700" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom Floating Subtitle Bar showing current voice text */}
            {isPlaying && isInteractiveMode && !isVoiceMuted && (
              <div className="absolute bottom-16 left-6 right-6 z-20 pointer-events-none flex justify-center">
                <p className="text-xs sm:text-sm font-medium text-stone-100 bg-stone-950/85 px-4 py-1.5 rounded-full border border-stone-800/80 shadow-lg text-center backdrop-blur-md max-w-2xl animate-fade-in">
                  "{CHAPTERS[activeScene]?.speechText}"
                </p>
              </div>
            )}
          </div>

          {/* Video Control Bar */}
          <div className="p-3 sm:p-4 bg-stone-900 border-t border-stone-800 text-stone-200 flex flex-col gap-3">
            {/* Timeline scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-stone-400 w-10">
                {formatTime(currentTime)}
              </span>

              <div
                className="relative flex-1 h-2.5 bg-stone-800 rounded-full overflow-hidden cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(pos * TOTAL_DURATION);
                }}
              >
                {/* Chapter dividers */}
                {CHAPTERS.map((ch, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-0.5 bg-stone-950 z-10"
                    style={{ left: `${(ch.startTime / TOTAL_DURATION) * 100}%` }}
                  />
                ))}

                {/* Scrubber Progress Bar */}
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (currentTime / TOTAL_DURATION) * 100)}%` }}
                />
              </div>

              <span className="text-[11px] font-mono text-stone-400 w-10 text-right">
                {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            {/* Chapters Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CHAPTERS.map((ch, idx) => {
                const isActive = activeScene === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSeek(ch.startTime)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-xs ring-1 ring-emerald-400/50'
                        : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-750'
                    }`}
                  >
                    {ch.label}
                  </button>
                );
              })}
            </div>

            {/* Playback Controls & Utility Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs"
                  title={isPlaying ? 'Pause' : 'Play Video'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isVoiceMuted
                      ? 'text-red-400 hover:bg-stone-800'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                  title={isVoiceMuted ? 'Unmute Male Narration' : 'Mute Voice Narration'}
                >
                  {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="hidden sm:flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg text-xs font-mono text-stone-300 border border-stone-750">
                  <span className="text-[10px] text-stone-400 uppercase">Voice Sync</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Playback speed selector */}
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 0.85 : 1)}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-[11px] font-mono text-stone-300 transition-colors cursor-pointer border border-stone-700"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Fullscreen button */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
