import React, { useState } from 'react';
import { Play, Github, Linkedin, Twitter, Mail, MapPin, Sparkles, ArrowRight, Award, Download, Phone, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';
import { VoicePlayer } from './VoicePlayer';
import { TypewriterText } from './TypewriterText';
import { downloadResumePdf } from '../utils/generatePdf';

interface HeroProps {
  data: PortfolioData;
  onOpenResume?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  data, 
  onOpenResume,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadResume = () => {
    downloadResumePdf(data);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    if (onOpenResume) {
      onOpenResume();
    }
  };

  const roles = [
    'Tejas India Hackathon Winner 🏆',
    'B.Tech IT Scholar @ HIT (9.16 CGPA)',
    'Research Assistant @ NSRI',
    'UPI Fraud & AI Security Architect',
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex items-center justify-center pt-32 pb-20 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Status badge & Hackathon & Voice player row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Tejas India Hackathon Winner 🏆</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>{data.status || 'Available for new roles & projects'}</span>
              </div>

              {/* Voice Narration Feature */}
              <VoicePlayer
                textToSpeak={data.voiceIntroText || `${data.name}, ${data.title}. ${data.tagline}`}
                authorName={data.name}
              />
            </div>

            {/* Greeting & Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-black mb-4 leading-[1.14]">
              Hello, I'm{' '}
              <span 
                className="text-transparent [-webkit-text-stroke:1.5px_black] sm:[-webkit-text-stroke:2px_black] tracking-wider font-extrabold inline-block"
                style={{ WebkitTextStroke: '2px black' }}
              >
                {data.name}
              </span>
            </h1>

            {/* Dynamic Animated Typewriter Line */}
            <div className="text-xl sm:text-2xl font-medium text-gray-700 mb-5 min-h-[36px] flex items-center justify-center lg:justify-start">
              <TypewriterText words={roles} />
            </div>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mb-7 leading-relaxed">
              {data.tagline}
            </p>

            {/* Verified Contact Meta */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-gray-600 mb-8 font-mono">
              {data.location && (
                <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{data.location}</span>
                </div>
              )}
              {data.phone && (
                <a
                  href={`tel:${data.phone.replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{data.phone}</span>
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 hover:text-emerald-700 font-sans transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{data.email}</span>
                </a>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10">
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-emerald-200"
              >
                Explore Projects
              </a>

              <button
                id="hero-download-cv-btn"
                onClick={handleDownloadResume}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-gray-900 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                title="Download Soumadip Das CV (PDF) immediately"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Downloaded PDF!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download CV (PDF)</span>
                  </>
                )}
              </button>

              <a
                href="/Soumadip_Das_Resume.pdf"
                download="Soumadip_Das_Resume.pdf"
                className="hidden"
                aria-hidden="true"
              >
                Download PDF
              </a>

              {data.videoShowcase?.enabled && (
                <a
                  href="#video-reel"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-800 border border-gray-300 hover:border-emerald-500 hover:text-emerald-700 font-medium text-sm transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>Watch Video Reel</span>
                </a>
              )}
            </div>

            {/* Social Links Bar */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold font-mono">
                Connect:
              </span>
              {data.social.github && (
                <a
                  href={data.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-black hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 shadow-2xs"
                  aria-label="GitHub"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {data.social.linkedin && (
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-blue-200 shadow-2xs"
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {data.social.twitter && (
                <a
                  href={data.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-black hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 shadow-2xs"
                  aria-label="Twitter / X"
                  title="X (Twitter) Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="p-2 text-gray-600 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 shadow-2xs"
                  aria-label="Email"
                  title="Email Direct"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Profile Photo Card in Minimalist Theme */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-3xl p-2.5 bg-white border border-gray-200 shadow-sm overflow-hidden">
              <img
                src={data.avatarUrl || '/soumadip.png'}
                alt={data.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.indexOf('soumadip.png') === -1) {
                    target.src = '/soumadip.png';
                  } else {
                    target.src = '/profile.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5 pointer-events-none" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
