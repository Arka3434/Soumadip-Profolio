import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Pause, RotateCcw, Check, ChevronDown, ChevronUp, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { speakText, stopSpeech, pauseSpeech, resumeSpeech } from '../utils/voice';
import { getStoredVoiceAudio } from '../utils/mediaStorage';

interface VoicePlayerProps {
  textToSpeak?: string;
  authorName?: string;
  compact?: boolean;
}

const REFERENCE_SENTENCES = [
  "Hi, I am Soumadip Das, an Information Technology student and AI and software developer, passionate about building practical, intelligent, and impactful technology solutions.",
  "As a 1× Hackathon Winner, I enjoy turning ideas into working products through problem-solving, software development, AI, and data-driven technologies.",
  "I have hands-on experience with Python, Java, C, C++, SQL, SQLite, HTML, CSS, JavaScript, Git, GitHub, Power BI, and Generative AI.",
  "My project experience includes SecureFlow AI, an AI-powered UPI fraud detection system and prevention platform developed for a national-level hackathon.",
  "Beyond development, I have experience in AI training, research, digital marketing, community engagement, and team leadership.",
  "I am continuously learning, experimenting with new technologies, and looking for opportunities to build solutions that solve real-world problems."
];

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ 
  textToSpeak, 
  compact = false
}) => {
  const fullText = textToSpeak || REFERENCE_SENTENCES.join(' ');

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Audio source state
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load custom voice audio from storage or static server asset on mount
  useEffect(() => {
    let isMounted = true;

    const resolveVoiceSource = async () => {
      // 1. Check local device storage cache
      try {
        const stored = await getStoredVoiceAudio();
        if (stored && isMounted) {
          setCustomAudioUrl(stored);
          return;
        }
      } catch (err) {
        console.warn('Could not read stored voice:', err);
      }

      // 2. Check if a static voice file exists in /public (supports mp3, m4a, wav, webm, ogg)
      const candidateFiles = [
        '/voice.mp3',
        '/voice.mpeg',
        '/voice.m4a',
        '/voice.wav',
        '/voice.webm',
        '/voice.ogg',
      ];

      for (const fileUrl of candidateFiles) {
        try {
          const res = await fetch(fileUrl, { method: 'HEAD' });
          if (res.ok && isMounted) {
            setCustomAudioUrl(fileUrl);
            return;
          }
        } catch {
          // File check ignored
        }
      }
    };

    resolveVoiceSource();

    return () => {
      isMounted = false;
      stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update audio playback rate if custom audio is active
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate]);

  // Main Toggle Play / Pause
  const handlePlayToggle = () => {
    if (isPlaying) {
      if (isPaused) {
        if (customAudioUrl && audioRef.current) {
          audioRef.current.play();
        } else {
          resumeSpeech();
        }
        setIsPaused(false);
      } else {
        if (customAudioUrl && audioRef.current) {
          audioRef.current.pause();
        } else {
          pauseSpeech();
        }
        setIsPaused(true);
      }
    } else {
      // Start fresh playback
      setIsPlaying(true);
      setIsPaused(false);

      if (customAudioUrl) {
        // Play authentic recorded voice audio
        if (!audioRef.current) {
          audioRef.current = new Audio(customAudioUrl);
        } else {
          audioRef.current.src = customAudioUrl;
        }

        audioRef.current.playbackRate = rate;
        audioRef.current.currentTime = 0;

        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            const total = audioRef.current.duration || 65;
            const progress = audioRef.current.currentTime / total;
            const sIdx = Math.min(
              REFERENCE_SENTENCES.length - 1,
              Math.floor(progress * REFERENCE_SENTENCES.length)
            );
            setActiveSentenceIndex(sIdx);
          }
        };

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setActiveSentenceIndex(0);
        };

        audioRef.current.play().catch((err) => {
          console.warn('Audio play failed, falling back to speech synthesis:', err);
          fallbackToSpeechSynthesis();
        });
      } else {
        fallbackToSpeechSynthesis();
      }
    }
  };

  const fallbackToSpeechSynthesis = () => {
    speakText(
      fullText,
      rate * 0.94,
      0.92,
      () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSentenceIndex(0);
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      (charIndex, totalLength) => {
        const progress = charIndex / (totalLength || 1);
        const sIdx = Math.min(
          REFERENCE_SENTENCES.length - 1,
          Math.floor(progress * REFERENCE_SENTENCES.length)
        );
        setActiveSentenceIndex(sIdx);
      }
    );
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(0);
  };

  const handleSpeedToggle = () => {
    const newRate = rate === 1.0 ? 1.2 : rate === 1.2 ? 0.9 : 1.0;
    setRate(newRate);
    if (isPlaying && !customAudioUrl) {
      stopSpeech();
      fallbackToSpeechSynthesis();
    }
  };

  return (
    <>
      {/* Primary Read-Only Voice Player Bar */}
      <div className="inline-flex flex-wrap items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/95 border border-gray-200/90 shadow-xs backdrop-blur-md">
        {/* Play/Pause Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handlePlayToggle}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isPlaying && !isPaused
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
          title={isPlaying && !isPaused ? 'Pause Voice Intro' : 'Listen to Soumadip’s Voice Intro'}
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{customAudioUrl ? "Hear My Voice" : "Hear Bio Aloud"}</span>
            </>
          )}
        </motion.button>

        {/* Animated Sound Waves */}
        <div className="flex items-center gap-0.5 px-2 h-5">
          {[40, 80, 100, 60, 95, 50, 75].map((height, idx) => (
            <motion.div
              key={idx}
              animate={
                isPlaying && !isPaused
                  ? {
                      height: ['25%', `${height}%`, '30%'],
                    }
                  : { height: '25%' }
              }
              transition={
                isPlaying && !isPaused
                  ? {
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: idx * 0.08,
                    }
                  : { duration: 0.3 }
              }
              className={`w-1 rounded-full transition-colors ${
                isPlaying && !isPaused ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Status Badge */}
        <div className="hidden sm:flex items-center">
          {customAudioUrl ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80">
              <Check className="w-2.5 h-2.5 text-emerald-600" />
              <span>Authentic Voice</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium border border-gray-200">
              <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
              <span>Voice Intro</span>
            </span>
          )}
        </div>

        {/* Transcript Toggle */}
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="p-1.5 text-gray-400 hover:text-gray-800 rounded-lg transition-colors cursor-pointer"
          title={showTranscript ? "Hide Transcript" : "View Live Spoken Transcript"}
        >
          {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Playback Controls (Speed & Reset) */}
        {isPlaying && (
          <div className="flex items-center gap-1 border-l border-gray-200 pl-1.5">
            <button
              onClick={handleSpeedToggle}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
              title="Toggle playback speed"
            >
              {rate}x
            </button>
            <button
              onClick={handleStop}
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
              title="Stop voice"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Expandable Live Subtitle / Transcript Viewer */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-2 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-xs space-y-2 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Spoken Bio Transcript
                </span>
                <span className="text-gray-400 text-[11px]">
                  Soumadip Das
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-gray-600 leading-relaxed max-h-48 overflow-y-auto pr-1">
              {REFERENCE_SENTENCES.map((sentence, idx) => (
                <p
                  key={idx}
                  className={`p-2 rounded-xl transition-all ${
                    isPlaying && activeSentenceIndex === idx
                      ? 'bg-emerald-50 text-emerald-950 font-medium border-l-2 border-emerald-600 shadow-2xs'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {sentence}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
