import React, { useState } from 'react';
import { X, Download, Printer, ExternalLink, Mail, Phone, MapPin, Github, Linkedin, Twitter, Award, CheckCircle2, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData } from '../types';
import { downloadResumePdf } from '../utils/generatePdf';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, data }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    downloadResumePdf(data);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const resumeText = `SOUMADIP DAS
B.Tech in Information Technology | Software & AI Engineer | Team Lead
Email: ${data.email} | Phone: ${data.phone} | Location: ${data.location}
LinkedIn: ${data.social.linkedin}
GitHub: ${data.social.github}
Twitter/X: ${data.social.twitter}

--------------------------------------------------
PROFILE
Dedicated Information Technology undergraduate at Haldia Institute of Technology with CGPA above 9.15, focused on software development, AI, data analysis, and cybersecurity. Team Lead on SecureFlow AI, an end-to-end UPI transaction fraud-detection platform developed for national-level hackathons. Experienced in Python, SQL/SQLite, Java, C/C++, web technologies, Power BI, and Git/GitHub, with research and campus leadership experience.

--------------------------------------------------
EDUCATION
1. Haldia Institute of Technology (HIT)
   B.Tech in Information Technology (IT) • Sep 2025 – Present
   CGPA: 9.15 (1st Year) | 9.16 (2nd Year) • Haldia, West Bengal
   Coursework: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Software Engineering.

2. Shimlapal Madan Mohan High School (SMMHS)
   Higher Secondary (Class XII), Science • Jun 2024 – May 2025
   Score: 93% • West Bengal, India
   Distinction-level performance in science and mathematics.

3. Amlasuli Indra Narayan High School (AINHS)
   Secondary Education (Class X) • Jun 2022 – Mar 2023
   Score: 92% • West Bengal, India
   Strong academic performance in secondary board examination.

--------------------------------------------------
KEY PROJECTS & HACKATHONS
1. UPI Fraud Detection System — SecureFlow AI
   Team Lead • Tejas India Hackathon 2026 • Sep 2026 – Present
   - Built a real-time UPI transaction fraud-monitoring platform with a Python backend and SQLite/SQL database layer.
   - Developed web dashboards for live transaction monitoring, fraud alerts, analytics, balance monitoring, administration, and security.
   - Designed relational schemas and SQL queries to identify anomalous transaction patterns and support automated risk detection.
   - Led development, testing, integration, and presentation of the end-to-end solution as Team Lead.
   Tech: Python, SQLite, SQL, JavaScript, HTML/CSS, Git/GitHub

2. Global Ripple Effects — Economic Impact of War
   Independent Research Project • May 2025
   - Researched economic impacts of global conflicts (2020–2023), analyzing inflation, energy prices, commodities, trade flows, and markets.
   - Collected, cleaned, and organized macroeconomic datasets from reliable global repositories.
   - Built interactive dashboards and analytical models in Microsoft Power BI to communicate multi-year trends.
   Tech: Power BI, Microsoft Excel, Data Analysis, Statistical Research

--------------------------------------------------
EXPERIENCE & LEADERSHIP
- Team Lead — SecureFlow AI (Tejas India Hackathon) • Sep 2026 – Present
- Research Assistant (National Student Research Institution - NSRI) • Jun 2026 – Present
- Digital Marketing Intern & Campus Ambassador (International Model United Nations - IMUN) • Apr 2025 – Jul 2026
- Campus Representative — Summer of Code 2026 (Elite Coders) • May 2026 – Jun 2026
- Campus Ambassador (Paytm Campus) • May 2026 – Jun 2026
- Campus Ambassador (Cloud Junction) • Jul 2026 – Present
- Brand Ambassador (launchED Global) • Jun 2026 – Present

--------------------------------------------------
TECHNICAL SKILLS
- Programming: C, C++, Java, Python, SQL
- Databases: DBMS, SQLite, SQL query optimization
- Web / Development: HTML, CSS, JavaScript, Full-Stack Development
- Tools: Git, GitHub, VS Code, Power BI, Microsoft Excel, Google Workspace
- Specialized: Data Analysis, Prompt Engineering (Generative AI), Research & Documentation

--------------------------------------------------
CERTIFICATIONS & ACHIEVEMENTS
- Tejas India Hackathon 2026 — Team Lead, SecureFlow AI (Winner)
- Google Cloud Gen AI Academy 2.0
- Google Cloud Arcade Guide 2026 Workshop
- Deloitte Cyber Job Simulation — Forage
- Goldman Sachs Operations Job Simulation — Forage
- Critical Thinking in the AI Era — HP LIFE
- Soft Skills and Presentation Skills — TCS iON
- Certificate of Excellence — Campus Ambassador & Outreach — IMUN

--------------------------------------------------
LANGUAGES & CAMPUS INVOLVEMENT
- Languages: English (Full Professional), Bengali (Native/Bilingual), Hindi (Full Professional)
- Campus Programs: Elite Coders, CampusCrew, NSRI, Paytm Campus Community
`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Soumadip_Das_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-gray-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Modal Header & Quick Actions */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">
                  Official Resume — Soumadip Das
                </h3>
                <p className="text-xs text-gray-500">
                  B.Tech in Information Technology • Tejas India Hackathon Winner
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="resume-download-pdf-btn"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                title="Download Soumadip Das Resume PDF directly"
              >
                {downloaded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF (CV)</span>
                  </>
                )}
              </button>

              <a
                href="/Soumadip_Das_Resume.pdf"
                download="Soumadip_Das_Resume.pdf"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold shadow-2xs transition-colors"
                title="Direct PDF file link"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                <span>Direct File</span>
              </a>

              <button
                onClick={handlePrint}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title="Print or Save via Browser Dialog"
              >
                <Printer className="w-3.5 h-3.5 text-gray-500" />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadText}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title="Download formatted text document"
              >
                <Download className="w-3.5 h-3.5 text-gray-400" />
                <span>.txt</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer ml-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-7 bg-white text-black selection:bg-emerald-100 print:p-0 print:m-0">
            {/* Document Header */}
            <div className="border-b border-gray-300 pb-5 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase">
                Soumadip Das
              </h1>
              <p className="text-sm sm:text-base font-semibold text-emerald-800 mt-1">
                B.Tech in Information Technology | Software & AI Engineer | Team Lead
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-600 font-mono">
                <a href={`mailto:${data.email}`} className="inline-flex items-center gap-1 hover:text-emerald-700 font-medium">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{data.email}</span>
                </a>
                <a href={`tel:${data.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-1 hover:text-emerald-700 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{data.phone}</span>
                </a>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{data.location}</span>
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold">
                <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline inline-flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
                <span className="text-gray-300">•</span>
                <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline inline-flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub (@soumadip-engage)</span>
                </a>
                <span className="text-gray-300">•</span>
                <a href={data.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline inline-flex items-center gap-1">
                  <Twitter className="w-3.5 h-3.5" />
                  <span>X / Twitter</span>
                </a>
              </div>
            </div>

            {/* Profile Section */}
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-2">
                Profile
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Dedicated Information Technology undergraduate at Haldia Institute of Technology with CGPA above 9.15, focused on software development, AI, data analysis, and cybersecurity. Team Lead on <strong>SecureFlow AI</strong>, an end-to-end UPI transaction fraud-detection platform developed for national-level hackathons. Experienced in Python, SQL/SQLite, Java, C/C++, web technologies, Power BI, and Git/GitHub, with research and campus leadership experience.
              </p>
            </div>

            {/* Education Section */}
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-3">
                Education
              </h2>
              <div className="space-y-3.5">
                <div className="border-l-2 border-emerald-500 pl-3.5">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="text-sm font-bold text-black">
                      Haldia Institute of Technology (HIT)
                    </h3>
                    <span className="text-xs font-mono text-gray-500">Sep 2025 – Present</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    B.Tech in Information Technology (IT) • Haldia, West Bengal
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                    CGPA: 9.15 (1st Year) | 9.16 (2nd Year)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Coursework: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Software Engineering.
                  </p>
                </div>

                <div className="border-l-2 border-gray-300 pl-3.5">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="text-sm font-bold text-black">
                      Shimlapal Madan Mohan High School (SMMHS)
                    </h3>
                    <span className="text-xs font-mono text-gray-500">Jun 2024 – May 2025</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Higher Secondary (Class XII), Science • West Bengal, India
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                    Score: 93% Distinction
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Distinction-level performance in science and mathematics.
                  </p>
                </div>

                <div className="border-l-2 border-gray-300 pl-3.5">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="text-sm font-bold text-black">
                      Amlasuli Indra Narayan High School (AINHS)
                    </h3>
                    <span className="text-xs font-mono text-gray-500">Jun 2022 – Mar 2023</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Secondary Education (Class X) • West Bengal, India
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                    Score: 92% Distinction
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Strong academic performance in secondary board examination.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Projects & Hackathons */}
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-3">
                Key Projects & Hackathons
              </h2>
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-black flex items-center gap-1.5">
                      <span>UPI Fraud Detection System — SecureFlow AI</span>
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-[10px] font-mono font-bold">
                        WINNER 🏆
                      </span>
                    </h3>
                    <span className="text-xs font-mono text-gray-600">Sep 2026 – Present</span>
                  </div>
                  <p className="text-xs font-semibold text-amber-900 mt-0.5">
                    Team Lead • Tejas India Hackathon 2026
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1">
                    <li>Built a real-time UPI transaction fraud-monitoring platform with a Python backend and SQLite/SQL database layer.</li>
                    <li>Developed web dashboards for live transaction monitoring, fraud alerts, analytics, balance monitoring, administration, and security.</li>
                    <li>Designed relational schemas and SQL queries to identify anomalous transaction patterns and support automated risk detection.</li>
                    <li>Led development, testing, integration, and presentation of the end-to-end solution as Team Lead.</li>
                  </ul>
                  <p className="text-[11px] font-mono text-gray-600 mt-2">
                    <strong>Tech:</strong> Python, SQLite, SQL, JavaScript, HTML/CSS, Git/GitHub
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-black">
                      Global Ripple Effects — Economic Impact of War
                    </h3>
                    <span className="text-xs font-mono text-gray-600">May 2025</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    Independent Quantitative Research Project
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1">
                    <li>Researched economic impacts of global conflicts (2020–2023), analyzing inflation, energy prices, commodities, trade flows, and markets.</li>
                    <li>Collected, cleaned, and organized macroeconomic datasets from reliable global repositories.</li>
                    <li>Built interactive dashboards and analytical models in Microsoft Power BI to communicate multi-year trends.</li>
                  </ul>
                  <p className="text-[11px] font-mono text-gray-600 mt-2">
                    <strong>Tech:</strong> Power BI, Microsoft Excel, Data Analysis, Statistical Research
                  </p>
                </div>
              </div>
            </div>

            {/* Experience & Leadership */}
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-3">
                Experience & Leadership
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Team Lead — SecureFlow AI</span>
                    <span className="font-mono text-gray-500 text-[11px]">Sep 2026 – Present</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">Tejas India Hackathon 2026</p>
                  <p className="text-gray-600 mt-0.5">Built real-time UPI fraud platform, developed monitoring dashboards, and led cross-functional team.</p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Research Assistant</span>
                    <span className="font-mono text-gray-500 text-[11px]">Jun 2026 – Present</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">National Student Research Institution (NSRI)</p>
                  <p className="text-gray-600 mt-0.5">Conducted scientific literature reviews, data collection, and qualitative/quantitative analysis.</p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Digital Marketing Intern & Campus Ambassador</span>
                    <span className="font-mono text-gray-500 text-[11px]">Apr 2025 – Jul 2026</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">International Model United Nations (IMUN)</p>
                  <p className="text-gray-600 mt-0.5">Promoted youth programs; received Certificate of Excellence for outstanding outreach.</p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Campus Representative — Summer of Code 2026</span>
                    <span className="font-mono text-gray-500 text-[11px]">May 2026 – Jun 2026</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">Elite Coders</p>
                  <p className="text-gray-600 mt-0.5">Represented Haldia Institute of Technology; fostered open-source culture and competitive coding.</p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Campus Ambassador</span>
                    <span className="font-mono text-gray-500 text-[11px]">May 2026 – Jun 2026</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">Paytm Campus</p>
                  <p className="text-gray-600 mt-0.5">Fintech awareness, student engagement, and digital payment literacy initiatives.</p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Campus Ambassador</span>
                    <span className="font-mono text-gray-500 text-[11px]">Jul 2026 – Present</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">Cloud Junction</p>
                  <p className="text-gray-600 mt-0.5">Promoted cloud architectures, technical workshops, hackathons, and student bootcamps.</p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Brand Ambassador</span>
                    <span className="font-mono text-gray-500 text-[11px]">Jun 2026 – Present</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">launchED Global</p>
                  <p className="text-gray-600 mt-0.5">Promoted career-focused technical initiatives and increased student participation.</p>
                </div>
              </div>
            </div>

            {/* Technical Skills & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-gray-200">
              <div>
                <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-3">
                  Technical Skills
                </h2>
                <div className="space-y-1.5 text-xs text-gray-700">
                  <p><strong>Programming:</strong> C, C++, Java, Python, SQL</p>
                  <p><strong>Databases:</strong> DBMS, SQLite, SQL query optimization</p>
                  <p><strong>Web / Dev:</strong> HTML, CSS, JavaScript, Full-Stack Development</p>
                  <p><strong>Tools:</strong> Git, GitHub, VS Code, Power BI, Microsoft Excel, Google Workspace</p>
                  <p><strong>Specialized:</strong> Data Analysis, Prompt Engineering (GenAI), Research & Documentation</p>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-3">
                  Certifications & Honors
                </h2>
                <ul className="space-y-1 text-xs text-gray-700 list-disc list-inside">
                  <li><strong>Tejas India Hackathon 2026</strong> — Team Lead (Winner)</li>
                  <li>Google Cloud Gen AI Academy 2.0</li>
                  <li>Google Cloud Arcade Guide 2026 Workshop</li>
                  <li>Deloitte Cyber Job Simulation — Forage</li>
                  <li>Goldman Sachs Operations Job Simulation — Forage</li>
                  <li>Critical Thinking in the AI Era — HP LIFE</li>
                  <li>Soft Skills and Presentation Skills — TCS iON</li>
                  <li>Certificate of Excellence — IMUN</li>
                </ul>
              </div>
            </div>

            {/* Languages */}
            <div className="pt-2 border-t border-gray-200 text-xs text-gray-600 flex flex-wrap gap-4">
              <span><strong>Languages:</strong> English (Full Professional), Bengali (Native), Hindi (Full Professional)</span>
            </div>
          </div>

          {/* Persistent Bottom Download Bar */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <p className="text-xs text-gray-600 text-center sm:text-left">
              Need a verified PDF copy for review or recruitment?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume (PDF)</span>
              </button>
              <a
                href="/Soumadip_Das_Resume.pdf"
                download="Soumadip_Das_Resume.pdf"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <span>Save File</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
