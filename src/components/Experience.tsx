import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  Filter,
  Download,
  Printer,
  FileText,
  Trophy,
  Globe,
  Terminal,
  CreditCard,
  Cloud,
  Rocket,
  Cpu,
  BrainCircuit,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData } from '../types';
import { downloadResumePdf } from '../utils/generatePdf';

interface ExperienceProps {
  data: PortfolioData;
  onOpenResume?: () => void;
}

interface BrandTheme {
  headline: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const getExperienceBrandTheme = (company: string, role: string): BrandTheme => {
  const c = company.toLowerCase();
  const r = role.toLowerCase();

  if (c.includes('tejas') || c.includes('hackathon')) {
    return {
      headline: 'NATIONAL LEVEL HACKATHON • CHAMPIONSHIP',
      badgeBg: 'bg-amber-500/10',
      badgeBorder: 'border-amber-300',
      badgeText: 'text-amber-900',
      iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
      iconColor: 'text-stone-950',
      icon: <Trophy className="w-5 h-5 text-stone-950 fill-stone-950" />
    };
  }

  if (c.includes('nsri') || c.includes('research')) {
    return {
      headline: 'ACADEMIC SCIENTIFIC RESEARCH • DATA & LITERATURE',
      badgeBg: 'bg-indigo-50',
      badgeBorder: 'border-indigo-200',
      badgeText: 'text-indigo-800',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      iconColor: 'text-white',
      icon: <FileText className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('imun') || c.includes('united nations')) {
    return {
      headline: 'GLOBAL DIPLOMACY & STUDENT ADVOCACY',
      badgeBg: 'bg-sky-50',
      badgeBorder: 'border-sky-200',
      badgeText: 'text-sky-800',
      iconBg: 'bg-gradient-to-br from-sky-400 to-blue-500',
      iconColor: 'text-white',
      icon: <Globe className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('elite coders') || c.includes('summer of code')) {
    return {
      headline: 'COMPETITIVE PROGRAMMING & OPEN SOURCE CULTURE',
      badgeBg: 'bg-purple-50',
      badgeBorder: 'border-purple-200',
      badgeText: 'text-purple-800',
      iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-700',
      iconColor: 'text-white',
      icon: <Terminal className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('paytm')) {
    return {
      headline: 'FINTECH ECOSYSTEM & DIGITAL PAYMENTS LITERACY',
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-200',
      badgeText: 'text-blue-800',
      iconBg: 'bg-gradient-to-br from-sky-500 to-blue-700',
      iconColor: 'text-white',
      icon: <CreditCard className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('cloud junction')) {
    return {
      headline: 'CLOUD ARCHITECTURE & STUDENT TECHNICAL BOOTCAMPS',
      badgeBg: 'bg-cyan-50',
      badgeBorder: 'border-cyan-200',
      badgeText: 'text-cyan-800',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      iconColor: 'text-white',
      icon: <Cloud className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('launched')) {
    return {
      headline: 'CAREER ACCELERATION & STUDENT OUTREACH',
      badgeBg: 'bg-orange-50',
      badgeBorder: 'border-orange-200',
      badgeText: 'text-orange-800',
      iconBg: 'bg-gradient-to-br from-orange-400 to-rose-500',
      iconColor: 'text-white',
      icon: <Rocket className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('micro1')) {
    return {
      headline: 'PRODUCTION FULL-STACK SOFTWARE ENGINEERING',
      badgeBg: 'bg-emerald-50',
      badgeBorder: 'border-emerald-200',
      badgeText: 'text-emerald-800',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
      iconColor: 'text-white',
      icon: <Cpu className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('handshake')) {
    return {
      headline: 'AI BENCHMARKING & HIGH-ACCURACY DATA VALIDATION',
      badgeBg: 'bg-rose-50',
      badgeBorder: 'border-rose-200',
      badgeText: 'text-rose-800',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
      iconColor: 'text-white',
      icon: <BrainCircuit className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('outlier')) {
    return {
      headline: 'REASONING ALIGNMENT & RLHF SPECIALIZED TRAINING',
      badgeBg: 'bg-teal-50',
      badgeBorder: 'border-teal-200',
      badgeText: 'text-teal-800',
      iconBg: 'bg-gradient-to-br from-teal-500 to-slate-700',
      iconColor: 'text-white',
      icon: <ShieldCheck className="w-5 h-5 text-white" />
    };
  }

  return {
    headline: 'PROFESSIONAL ROLE & COLLABORATION',
    badgeBg: 'bg-stone-50',
    badgeBorder: 'border-stone-200',
    badgeText: 'text-stone-800',
    iconBg: 'bg-gradient-to-br from-stone-600 to-stone-800',
    iconColor: 'text-white',
    icon: <Briefcase className="w-5 h-5 text-white" />
  };
};

const getCertificateBrandTheme = (name: string, issuer: string): {
  headline: string;
  iconBg: string;
  accentBorder: string;
  icon: React.ReactNode;
} => {
  const n = name.toLowerCase();
  const iss = issuer.toLowerCase();

  if (n.includes('tejas') || n.includes('hackathon') || iss.includes('tejas')) {
    return {
      headline: 'NATIONAL HACKATHON WINNER',
      iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950',
      accentBorder: 'hover:border-amber-400',
      icon: <Trophy className="w-4 h-4 text-stone-950 fill-stone-950" />
    };
  }

  if (n.includes('google') || iss.includes('google')) {
    return {
      headline: 'GENERATIVE AI & CLOUD WORKSHOP',
      iconBg: 'bg-gradient-to-br from-blue-500 via-green-500 to-amber-500 text-white',
      accentBorder: 'hover:border-blue-400',
      icon: <Cloud className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('deloitte') || iss.includes('deloitte')) {
    return {
      headline: 'CYBERSECURITY SIMULATION',
      iconBg: 'bg-gradient-to-br from-stone-900 to-emerald-600 text-white',
      accentBorder: 'hover:border-emerald-400',
      icon: <ShieldCheck className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('goldman') || iss.includes('goldman')) {
    return {
      headline: 'GLOBAL OPERATIONS SIMULATION',
      iconBg: 'bg-gradient-to-br from-blue-900 to-amber-500 text-white',
      accentBorder: 'hover:border-blue-400',
      icon: <Award className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('hp') || iss.includes('hp')) {
    return {
      headline: 'CRITICAL THINKING IN AI',
      iconBg: 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white',
      accentBorder: 'hover:border-cyan-400',
      icon: <BrainCircuit className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('tcs') || iss.includes('tcs')) {
    return {
      headline: 'CORPORATE PRESENTATION & SOFT SKILLS',
      iconBg: 'bg-gradient-to-br from-purple-700 to-indigo-800 text-white',
      accentBorder: 'hover:border-purple-400',
      icon: <Sparkles className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('imun') || iss.includes('imun')) {
    return {
      headline: 'GLOBAL EXCELLENCE & OUTREACH',
      iconBg: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white',
      accentBorder: 'hover:border-sky-400',
      icon: <Globe className="w-4 h-4 text-white" />
    };
  }

  return {
    headline: 'TECHNICAL CERTIFICATION',
    iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white',
    accentBorder: 'hover:border-emerald-400',
    icon: <Award className="w-4 h-4 text-white" />
  };
};

export const Experience: React.FC<ExperienceProps> = ({ data, onOpenResume }) => {
  const [filter, setFilter] = useState<'all' | 'engineering' | 'research' | 'leadership'>('all');

  const filteredExperiences = data.experiences.filter((exp) => {
    if (filter === 'all') return true;
    const text = (exp.role + ' ' + exp.company + ' ' + exp.description).toLowerCase();
    if (filter === 'engineering') {
      return text.includes('engineer') || text.includes('hackathon') || text.includes('ai') || text.includes('full stack');
    }
    if (filter === 'research') {
      return text.includes('research') || text.includes('nsri') || text.includes('trainer') || text.includes('academic');
    }
    if (filter === 'leadership') {
      return text.includes('ambassador') || text.includes('lead') || text.includes('chapter') || text.includes('partner') || text.includes('imun') || text.includes('paytm');
    }
    return true;
  });

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 border-t border-stone-200/80 bg-stone-50/60">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>04 // Career & Education</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-2">
            Experience & Academic Record
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Comprehensive track record across software engineering, AI data training, academic research at NSRI, and campus community leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Work & Leadership Experience Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Roles & Positions ({data.experiences.length})</span>
                </div>

                {/* Interactive Filter Pills */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'all' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All ({data.experiences.length})
                  </button>
                  <button
                    onClick={() => setFilter('engineering')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'engineering' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Engineering
                  </button>
                  <button
                    onClick={() => setFilter('research')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'research' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Research
                  </button>
                  <button
                    onClick={() => setFilter('leadership')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'leadership' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Leadership
                  </button>
                </div>
              </div>

              {/* Roles Timeline with Colorful Logos and Headlines */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredExperiences.map((item, idx) => {
                    const theme = getExperienceBrandTheme(item.company, item.role);
                    const isHackathonWin = item.company.toLowerCase().includes('tejas') || item.role.toLowerCase().includes('winner');

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: idx * 0.04 }}
                        className={`group p-5 rounded-2xl transition-all border shadow-xs hover:shadow-md ${
                          isHackathonWin
                            ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-200'
                            : 'bg-white border-stone-200/90 hover:border-emerald-300'
                        }`}
                      >
                        {/* Distinct Brand Header & Headline */}
                        <div className="flex items-start gap-3.5 mb-3">
                          {/* Colorful Company Emblem / Logo */}
                          <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center shadow-xs ${theme.iconBg}`}>
                            {theme.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Colorful Headline Tag */}
                            <span className="block text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-800 mb-0.5">
                              {theme.headline}
                            </span>

                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                                {item.role}
                              </h3>
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                                {item.period}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-stone-700 mt-0.5 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>{item.company}</span>
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-stone-600 leading-relaxed mb-3 pl-1">
                          {item.description}
                        </p>

                        {/* Technology Badges */}
                        {item.skills && item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-1">
                            {item.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Education & Certifications Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Education Sub-section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Education (Official Record)</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                  Verified Academic Records
                </span>
              </div>

              <div className="space-y-4">
                {data.educations.map((edu) => (
                  <motion.div
                    key={edu.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-stone-900">
                        {edu.degree}
                      </h4>
                      <span className="text-[11px] font-mono text-stone-500 shrink-0">
                        {edu.period}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 font-semibold mb-2">
                      {edu.institution}
                    </p>

                    {edu.score && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-emerald-100/90 text-emerald-900 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          {edu.score}
                        </span>
                      </div>
                    )}

                    {edu.details && (
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {edu.details}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications & Industry Simulations with Colorful Logos and Headlines */}
            {data.certifications && data.certifications.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4 text-stone-900 font-bold text-base">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Certifications & Industry Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.certifications.map((cert) => {
                    const certTheme = getCertificateBrandTheme(cert.name, cert.issuer);

                    return (
                      <motion.div
                        key={cert.id}
                        whileHover={{ y: -2 }}
                        className={`p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs transition-all ${certTheme.accentBorder}`}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-2xs shrink-0 ${certTheme.iconBg}`}>
                            {certTheme.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-700 block truncate">
                              {certTheme.headline}
                            </span>
                            <span className="text-xs font-bold text-stone-900 block leading-tight truncate">
                              {cert.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                          <span className="text-stone-700 font-medium truncate max-w-[170px]">{cert.issuer}</span>
                          {cert.year && <span className="font-mono text-stone-400 shrink-0 font-semibold">{cert.year}</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resume Download Feature Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-white shadow-lg border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="p-3 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Official Resume & Academic Profile
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Download or print Soumadip Das's comprehensive CV with coursework, verified scores & hackathon records.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    downloadResumePdf(data);
                    if (onOpenResume) {
                      onOpenResume();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm cursor-pointer"
                  title="Download Soumadip Das Resume (PDF)"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV (PDF)</span>
                </button>
                <a
                  href="/Soumadip_Das_Resume.pdf"
                  download="Soumadip_Das_Resume.pdf"
                  className="hidden sm:inline-flex items-center px-3 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-all"
                >
                  Direct File
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
