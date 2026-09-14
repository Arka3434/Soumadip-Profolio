import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, Sparkles, GraduationCap, Award, Terminal, RotateCcw, Check } from 'lucide-react';
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
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(TOTAL_DURATION);

  const containerRef = useRef<HTMLDivElement>(null);
  const rawVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeChapterRef = useRef<number>(0);
  const chapterStartTimestampRef = useRef<number>(Date.now());

  // Check for authentic voice recording (/voice.mp3, /voice.mpeg) on mount
  useEffect(() => {
    let isMounted = true;
    const candidateFiles = [
      '/voice.mp3',
      '/voice.mpeg',
      '/voice.m4a',
      '/voice.wav',
      '/voice.webm',
    ];

    const checkAudio = async () => {
      for (const fileUrl of candidateFiles) {
        try {
          const res = await fetch(fileUrl, { method: 'HEAD' });
          if (res.ok && isMounted) {
            setCustomAudioUrl(fileUrl);
            const a = new Audio(fileUrl);
            a.onloadedmetadata = () => {
              if (a.duration && !isNaN(a.duration) && isMounted) {
                setTotalDuration(Math.max(30, Math.round(a.duration)));
              }
            };
            return;
          }
        } catch {
          // ignore
        }
      }
    };

    checkAudio();

    return () => {
      isMounted = false;
      stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Compute dynamic chapters based on actual audio duration
  const dynamicChapters = useMemo(() => {
    if (!customAudioUrl) return CHAPTERS;
    const durPerChapter = totalDuration / CHAPTERS.length;
    return CHAPTERS.map((ch, idx) => ({
      ...ch,
      startTime: idx * durPerChapter,
      endTime: (idx + 1) * durPerChapter,
      duration: durPerChapter,
    }));
  }, [customAudioUrl, totalDuration]);

  // Determine active chapter by timestamp
  const getChapterIndexFromTime = useCallback((time: number): number => {
    for (const ch of dynamicChapters) {
      if (time >= ch.startTime && time < ch.endTime) {
        return ch.index;
      }
    }
    return dynamicChapters.length - 1;
  }, [dynamicChapters]);

  const activeScene = getChapterIndexFromTime(currentTime);

  // Synchronize playback speed for audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Synchronize mute state for audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isVoiceMuted;
    }
  }, [isVoiceMuted]);

  // Synchronized playback executor for each chapter (TTS fallback)
  const playChapter = useCallback((chIndex: number, startOffsetWithinChapter = 0) => {
    if (chIndex >= dynamicChapters.length) {
      setIsPlaying(false);
      setCurrentTime(totalDuration);
      stopSpeech();
      return;
    }

    activeChapterRef.current = chIndex;
    const currentCh = dynamicChapters[chIndex];
    chapterStartTimestampRef.current = Date.now() - (startOffsetWithinChapter * 1000) / playbackSpeed;
    setCurrentTime(currentCh.startTime + startOffsetWithinChapter);

    stopSpeech();

    if (!isVoiceMuted && isInteractiveMode && !customAudioUrl) {
      speakText(
        currentCh.speechText,
        0.96 * playbackSpeed,
        0.92,
        () => {
          if (activeChapterRef.current === chIndex) {
            if (chIndex < dynamicChapters.length - 1) {
              playChapter(chIndex + 1, 0);
            } else {
              setIsPlaying(false);
              setCurrentTime(totalDuration);
            }
          }
        },
        (err) => {
          console.warn('Voice narration notice:', err);
        },
        (charIndex, totalChars) => {
          if (activeChapterRef.current === chIndex && totalChars > 0) {
            const fraction = Math.min(Math.max(charIndex / totalChars, 0), 1);
            const syncedTime = currentCh.startTime + fraction * currentCh.duration;
            setCurrentTime(syncedTime);
          }
        }
      );
    }
  }, [isVoiceMuted, isInteractiveMode, playbackSpeed, customAudioUrl, dynamicChapters, totalDuration]);

  // High precision animation frame timer loop (only needed for synthetic mode or muted mode without audio file)
  useEffect(() => {
    if (!isPlaying || !isInteractiveMode || customAudioUrl) return;

    let animationFrameId: number;

    const tick = () => {
      const chIndex = activeChapterRef.current;
      const ch = dynamicChapters[chIndex];
      if (!ch) return;

      const elapsedSec = ((Date.now() - chapterStartTimestampRef.current) / 1000) * playbackSpeed;

      if (isVoiceMuted) {
        if (elapsedSec >= ch.duration) {
          if (chIndex < dynamicChapters.length - 1) {
            playChapter(chIndex + 1, 0);
          } else {
            setIsPlaying(false);
            setCurrentTime(totalDuration);
            return;
          }
        } else {
          setCurrentTime(ch.startTime + elapsedSec);
        }
      } else {
        const progressTarget = ch.startTime + Math.min(elapsedSec, ch.duration - 0.05);
        setCurrentTime((prev) => Math.max(prev, progressTarget));
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isVoiceMuted, isInteractiveMode, playbackSpeed, playChapter, customAudioUrl, dynamicChapters, totalDuration]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
      if (customAudioUrl && audioRef.current) {
        audioRef.current.pause();
      }
      if (rawVideoRef.current) rawVideoRef.current.pause();
    } else {
      setIsPlaying(true);
      if (isInteractiveMode) {
        stopSpeech();
        if (customAudioUrl) {
          if (!audioRef.current) {
            const audioObj = new Audio(customAudioUrl);
            audioRef.current = audioObj;
            audioObj.playbackRate = playbackSpeed;
            audioObj.muted = isVoiceMuted;
            audioObj.ontimeupdate = () => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            };
            audioObj.onended = () => {
              setIsPlaying(false);
              setCurrentTime(0);
            };
          }

          if (currentTime >= totalDuration - 0.5) {
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
          } else {
            audioRef.current.currentTime = currentTime;
          }

          audioRef.current.play().catch((err) => {
            console.warn('Audio play error, fallback to synthetic voice:', err);
            let chIdx = getChapterIndexFromTime(currentTime);
            const offset = Math.max(0, currentTime - dynamicChapters[chIdx].startTime);
            playChapter(chIdx, offset);
          });
        } else {
          let chIdx = getChapterIndexFromTime(currentTime);
          if (currentTime >= totalDuration - 0.2) {
            chIdx = 0;
            setCurrentTime(0);
          }
          const offset = Math.max(0, currentTime - dynamicChapters[chIdx].startTime);
          playChapter(chIdx, offset);
        }
      } else {
        if (rawVideoRef.current) {
          rawVideoRef.current.play().catch((e) => console.warn('Video play error', e));
        }
      }
    }
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(time, totalDuration));
    setCurrentTime(clamped);
    if (customAudioUrl && audioRef.current) {
      audioRef.current.currentTime = clamped;
    } else {
      const chIdx = getChapterIndexFromTime(clamped);
      const offset = Math.max(0, clamped - dynamicChapters[chIdx].startTime);

      if (isPlaying) {
        stopSpeech();
        playChapter(chIdx, offset);
      } else {
        activeChapterRef.current = chIdx;
        stopSpeech();
      }
    }
  };

  const handleReset = () => {
    stopSpeech();
    setCurrentTime(0);
    activeChapterRef.current = 0;
    if (customAudioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    } else if (isPlaying) {
      playChapter(0, 0);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isVoiceMuted;
    setIsVoiceMuted(nextMuted);
    if (customAudioUrl && audioRef.current) {
      audioRef.current.muted = nextMuted;
    } else {
      if (!isVoiceMuted) {
        stopSpeech();
      } else {
        if (isPlaying && isInteractiveMode) {
          const chIdx = getChapterIndexFromTime(currentTime);
          const offset = Math.max(0, currentTime - dynamicChapters[chIdx].startTime);
          playChapter(chIdx, offset);
        }
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
    <section id="video-reel" className="py-20 px-4 sm:px-6 bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-8">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>Interactive Profile Showreel</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mt-2">
            {showcase.title || 'Profile Video & Work in Motion'}
          </h2>
          <p className="text-sm text-gray-600 mt-1.5 max-w-xl">
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
          className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-gray-800"
        >
          {/* Main Video Viewport (16:9) */}
          <div className="relative aspect-video w-full overflow-hidden bg-radial from-gray-900 to-black select-none">
            
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
                    {dynamicChapters[activeScene]?.label}
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
                            (e.target as HTMLImageElement).src = '/soumadip.png';
                          }}
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-amber-400 text-black font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
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
                      <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
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
                      <span className="text-[11px] font-mono text-gray-400">Consistent Top Rank</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-4 rounded-2xl bg-gray-900/80 border border-emerald-500/40 shadow-lg flex flex-col justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 block">9.16</span>
                          <span className="text-xs font-bold text-white mt-1 block">B.Tech IT</span>
                          <span className="text-[11px] text-gray-400">Haldia Inst. of Tech</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 mt-2 bg-emerald-950/60 py-0.5 px-1.5 rounded self-start">
                          1st Yr: 9.15 | 2nd Yr: 9.16
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-700 shadow-lg flex flex-col justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">93%</span>
                          <span className="text-xs font-bold text-white mt-1 block">Higher Secondary (XII)</span>
                          <span className="text-[11px] text-gray-400">Science Stream Distinction</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-300 mt-2 bg-gray-800 py-0.5 px-1.5 rounded self-start">
                          WBCHSE Board
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-700 shadow-lg flex flex-col justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">92%</span>
                          <span className="text-xs font-bold text-white mt-1 block">Secondary (Class X)</span>
                          <span className="text-[11px] text-gray-400">High Academic Distinction</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-300 mt-2 bg-gray-800 py-0.5 px-1.5 rounded self-start">
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
                    <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/90 border border-emerald-500/50 shadow-2xl">
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

                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                        Real-time transaction monitoring platform built with Python and SQLite/SQL. Analyzes anomalous patterns, velocity spikes, and fraud alerts across live web dashboards.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-gray-800/80 border border-gray-700">
                          <span className="font-mono text-emerald-400 font-bold block">&lt; 85ms</span>
                          <span className="text-[10px] text-gray-400">Inference Latency</span>
                        </div>
                        <div className="p-2 rounded-xl bg-gray-800/80 border border-gray-700">
                          <span className="font-mono text-emerald-400 font-bold block">Python + SQL</span>
                          <span className="text-[10px] text-gray-400">Engine Backend</span>
                        </div>
                        <div className="p-2 rounded-xl bg-gray-800/80 border border-gray-700">
                          <span className="font-mono text-emerald-400 font-bold block">FastAPI</span>
                          <span className="text-[10px] text-gray-400">Microservice Stack</span>
                        </div>
                        <div className="p-2 rounded-xl bg-gray-800/80 border border-gray-700">
                          <span className="font-mono text-emerald-400 font-bold block">Telemetry</span>
                          <span className="text-[10px] text-gray-400">Fraud Dashboards</span>
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
                      <span className="text-[11px] font-mono text-gray-400">11 Career Experiences</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-gray-900/85 border border-gray-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          RI
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Research Assistant @ NSRI</h5>
                          <p className="text-[11px] text-gray-400 mt-0.5">Applied computing, documentation & algorithmic problem solving.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-gray-900/85 border border-gray-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          M1
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Full Stack Engineer @ micro1</h5>
                          <p className="text-[11px] text-gray-400 mt-0.5">Freelance engineering delivering performant architectures.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-gray-900/85 border border-gray-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          HS
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">AI Data Trainer @ Handshake</h5>
                          <p className="text-[11px] text-gray-400 mt-0.5">Model evaluation, prompt refinement & certification standards.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-gray-900/85 border border-gray-700 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                          OA
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">AI Specialist @ Outlier AI</h5>
                          <p className="text-[11px] text-gray-400 mt-0.5">Reinforcement learning (RLHF) and reasoning alignment.</p>
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
                          className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-700 text-xs font-mono text-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 flex flex-wrap justify-center items-center gap-3">
                      <a
                        href={`mailto:${data.email}`}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-colors cursor-pointer"
                      >
                        Email: {data.email}
                      </a>
                      <a
                        href={data.social.linkedin || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs border border-gray-600 transition-colors"
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
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-30"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-white/30 opacity-75" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-black flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 text-emerald-700" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom Floating Subtitle Bar showing current voice text */}
            {isPlaying && isInteractiveMode && !isVoiceMuted && (
              <div className="absolute bottom-16 left-6 right-6 z-20 pointer-events-none flex justify-center">
                <p className="text-xs sm:text-sm font-medium text-gray-100 bg-black/85 px-4 py-1.5 rounded-full border border-gray-800/80 shadow-lg text-center backdrop-blur-md max-w-2xl animate-fade-in">
                  "{dynamicChapters[activeScene]?.speechText}"
                </p>
              </div>
            )}
          </div>

          {/* Video Control Bar */}
          <div className="p-3 sm:p-4 bg-gray-900 border-t border-gray-800 text-gray-200 flex flex-col gap-3">
            {/* Timeline scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-gray-400 w-10">
                {formatTime(currentTime)}
              </span>

              <div
                className="relative flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(pos * totalDuration);
                }}
              >
                {/* Chapter dividers */}
                {dynamicChapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-0.5 bg-black z-10"
                    style={{ left: `${(ch.startTime / totalDuration) * 100}%` }}
                  />
                ))}

                {/* Scrubber Progress Bar */}
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (currentTime / totalDuration) * 100)}%` }}
                />
              </div>

              <span className="text-[11px] font-mono text-gray-400 w-10 text-right">
                {formatTime(totalDuration)}
              </span>
            </div>

            {/* Chapters Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {dynamicChapters.map((ch, idx) => {
                const isActive = activeScene === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSeek(ch.startTime)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-xs ring-1 ring-emerald-400/50'
                        : 'bg-gray-800/80 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
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
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isVoiceMuted
                      ? 'text-red-400 hover:bg-gray-800'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                  title={isVoiceMuted ? 'Unmute Voice' : 'Mute Voice'}
                >
                  {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {customAudioUrl ? (
                  <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-lg text-xs font-mono text-emerald-300 border border-emerald-700/60" title="Playing Soumadip's Authentic Voice Recording">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">Authentic Voice</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1 rounded-lg text-xs font-mono text-gray-300 border border-gray-700">
                    <span className="text-[10px] text-gray-400 uppercase">Voice Sync</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Playback speed selector */}
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 0.85 : 1)}
                  className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-mono text-gray-300 transition-colors cursor-pointer border border-gray-700"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Fullscreen button */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors cursor-pointer"
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
