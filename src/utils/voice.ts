/**
 * Browser Speech Synthesis (Text-to-Speech) and Speech Recognition (Voice Typing) helpers.
 * Configured specifically with masculine voice prioritization and natural speech cadence.
 */

export interface VoiceState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  pitch: number;
}

// Helper to select the best available male voice from the browser's speech synthesis engine
export function getBestMaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Known female voice names to strictly exclude
  const femaleKeywords = [
    'female', 'woman', 'samantha', 'victoria', 'karen', 'zira', 'fiona', 'moira',
    'susan', 'hazel', 'catherine', 'jenny', 'aria', 'helena', 'sara', 'linda',
    'anna', 'stephanie', 'allison', 'ava', 'alva', 'agnes', 'veena', 'tessa', 'heera', 'neerja',
    'zira', 'kavya'
  ];

  // Prioritized male voices (prioritizing natural Indian English and warm British/US male voices)
  const priorityKeywords = [
    'en-in', 'india', 'ravi', 'rishi', 'prabhat',
    'daniel', 'david', 'guy', 'ryan', 'george', 'alex', 'fred', 'mark',
    'oliver', 'james', 'aaron', 'arthur', 'steven', 'thomas',
    'google uk english male', 'microsoft david', 'microsoft mark', 'microsoft guy',
    'en-in-standard-b', 'en-us-standard-b', 'en-us-standard-c', 'male'
  ];

  // 1. Search for a matching priority male voice that is not female
  for (const kw of priorityKeywords) {
    const match = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      const isEnglish = lang.startsWith('en');
      const isFemale = femaleKeywords.some((f) => name.includes(f));
      return isEnglish && (name.includes(kw) || lang.includes(kw)) && !isFemale;
    });
    if (match) return match;
  }

  // 2. Search for any English voice not explicitly marked female
  const nonFemaleEn = voices.find((v) => {
    const name = v.name.toLowerCase();
    const isEnglish = v.lang.toLowerCase().startsWith('en');
    const isFemale = femaleKeywords.some((f) => name.includes(f));
    return isEnglish && !isFemale;
  });
  if (nonFemaleEn) return nonFemaleEn;

  // 3. Fallback to any English voice
  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  if (anyEnglish) return anyEnglish;

  return voices[0] || null;
}

// Pre-warm voices cache
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getBestMaleVoice();
  };
}

// Phonetic enhancement so browser speech engines pronounce names and technical acronyms clearly and accurately
export function prepareSpeechText(text: string): string {
  if (!text) return '';
  return text
    // Natural pronunciation for Soumadip Das and technical terms
    .replace(/Soumadip\s+Das/gi, 'Soumadip Das')
    .replace(/Soumadip/gi, 'Soumadip')
    .replace(/1x\s+hackathon\s+winner/gi, 'One-time Hackathon Winner')
    .replace(/1×\s+Hackathon\s+Winner/gi, 'One-time Hackathon Winner')
    .replace(/Tejas/gi, 'Tejas')
    .replace(/Haldia/gi, 'Haldia')
    .replace(/NSRI\b/g, 'N S R I')
    .replace(/CGPA\b/gi, 'C G P A')
    .replace(/UPI\b/gi, 'U P I')
    .replace(/IMUN\b/g, 'I M U N')
    .replace(/RLHF\b/g, 'R L H F')
    .replace(/DBMS\b/g, 'D B M S')
    .replace(/SQLite\b/gi, 'S Q L Lite')
    .replace(/SQL\b/g, 'S Q L')
    .replace(/AI\b/g, 'A I')
    .replace(/C\+\+/g, 'C plus plus');
}

// Speak text using browser SpeechSynthesis with male voice characteristics
export function speakText(
  text: string,
  rate = 0.95,
  pitch = 0.92, // slightly lowered pitch ensures rich, authoritative male tone
  onEnd?: () => void,
  onError?: (err: any) => void,
  onBoundary?: (charIndex: number, textLength: number) => void,
  onStart?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Apply phonetic correction
  const processedText = prepareSpeechText(text);

  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.rate = rate;
  utterance.pitch = pitch;

  const maleVoice = getBestMaleVoice();
  if (maleVoice) {
    utterance.voice = maleVoice;
    utterance.lang = maleVoice.lang || 'en-US';
  }

  if (onStart) {
    utterance.onstart = () => {
      onStart();
    };
  }

  if (onBoundary) {
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      onBoundary(event.charIndex, processedText.length);
    };
  }

  if (onEnd) {
    utterance.onend = () => {
      onEnd();
    };
  }

  if (onError) {
    utterance.onerror = (err) => {
      if (err.error !== 'canceled' && err.error !== 'interrupted') {
        onError(err);
      }
    };
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

// Stop any currently active speech synthesis
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Pause ongoing speech synthesis
export function pauseSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

// Resume paused speech synthesis
export function resumeSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

/**
 * Speech Recognition (Speech-to-Text / Voice Typing)
 * Provides seamless voice dictation into the contact form message field.
 */
export function createSpeechRecognizer(
  onTranscript: (text: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
): any {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const transcript = finalTranscript || interimTranscript;
    if (transcript) {
      onTranscript(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
