import React from 'react';
import { User, Code2, Briefcase, Award, MapPin, CheckCircle2, Volume2, Sparkles, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';
import { VoicePlayer } from './VoicePlayer';

interface AboutProps {
  data: PortfolioData;
  onOpenResume?: () => void;
}

export const About: React.FC<AboutProps> = ({ data, onOpenResume }) => {
  const highlights = [
    { label: 'Hackathon Record', value: '1× Winner 🏆' },
    { label: 'HIT CGPA (IT)', value: '9.16' },
    { label: 'Professional Roles', value: '10+ Roles' },
    { label: 'HS & Secondary Boards', value: '93% & 92%' },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 border-t border-stone-200/80 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              01 // Background
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-2">
              About Me
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <VoicePlayer
              textToSpeak={data.bio.join(' ')}
              authorName={data.name}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Bio Text */}
          <div className="lg:col-span-7 space-y-4 text-stone-700 text-base leading-relaxed">
            <p>
              I’m <strong>Soumadip Das</strong>, an Information Technology student and <strong>AI & Software Developer</strong> passionate about building practical, intelligent, and impactful technology solutions. As a <strong>1× Hackathon Winner</strong>, I enjoy turning ideas into working products through problem-solving, software development, AI, and data-driven technologies.
            </p>

            <p>
              I have hands-on experience with <strong>Python, Java, C/C++, SQL, SQLite, HTML, CSS, JavaScript, Git, GitHub, Power BI, and Generative AI</strong>. My project experience includes <strong>SecureFlow AI</strong>, an AI-powered UPI fraud detection and prevention platform developed for a national-level hackathon.
            </p>

            <p>
              Beyond development, I have experience in <strong>AI training, research, digital marketing, community engagement, and team leadership</strong>. I’m continuously learning, experimenting with new technologies, and looking for opportunities to build solutions that solve real-world problems.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-sm text-stone-800 font-medium">
              <strong className="text-emerald-950 font-bold block mb-1">Currently focused on:</strong>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-900">
                <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 shadow-2xs">AI</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 shadow-2xs">Software Development</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 shadow-2xs">Cybersecurity</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 shadow-2xs">FinTech</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 shadow-2xs">Data & Analytics</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 shadow-2xs">Generative AI</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Clean Architecture & Performance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Applied AI & Machine Learning
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Cross-Functional Team Leadership
              </span>
            </div>
          </div>

          {/* Quick Metrics & Stats Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs flex flex-col justify-between"
              >
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs font-medium text-stone-500 mt-2">
                  {item.label}
                </span>
              </motion.div>
            ))}

            {/* Direct Contact snippet */}
            <div className="col-span-2 p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-mono">Location</span>
                <span className="text-stone-800 font-medium">{data.location || 'Haldia, West Bengal, India'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-mono">Direct Phone</span>
                <a href={`tel:${data.phone.replace(/[^+\d]/g, '')}`} className="text-emerald-700 font-semibold hover:underline">
                  {data.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-mono">Direct Email</span>
                <a href={`mailto:${data.email}`} className="text-emerald-700 font-medium hover:underline">
                  {data.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
