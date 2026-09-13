import React, { useState } from 'react';
import { ExternalLink, Github, Plus, Film, Play, Pause, Award, ShieldAlert, ShieldCheck, Activity, BarChart3, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData, Project } from '../types';

interface ProjectsProps {
  data: PortfolioData;
}

export const Projects: React.FC<ProjectsProps> = ({ data }) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // UPI Fraud Live Simulator State
  const [showUpiSim, setShowUpiSim] = useState(false);
  const [simTxnType, setSimTxnType] = useState<'safe' | 'fraud' | 'high_value'>('safe');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    score: number;
    status: 'APPROVED' | 'FLAGGED' | 'CHALLENGE';
    flags: string[];
    latency: number;
  }>({
    score: 12,
    status: 'APPROVED',
    flags: ['Device MAC Match', 'Known Geolocation', 'Standard Merchant Category'],
    latency: 38,
  });

  // Economic Impact Explorer State
  const [showEconExplorer, setShowEconExplorer] = useState(false);
  const [selectedYear, setSelectedYear] = useState<2020 | 2021 | 2022 | 2023>(2022);

  const econData = {
    2020: {
      energyIndex: 42,
      inflation: 3.2,
      supplyChainDisruption: 55,
      foodIndex: 61,
      summary: 'Initial pandemic shock, transport bottlenecks, and fiscal stimulus stabilization.',
    },
    2021: {
      energyIndex: 68,
      inflation: 4.7,
      supplyChainDisruption: 78,
      foodIndex: 75,
      summary: 'Global demand rebound meets severe shipping port congestion and semiconductor shortages.',
    },
    2022: {
      energyIndex: 98,
      inflation: 8.8,
      supplyChainDisruption: 92,
      foodIndex: 94,
      summary: 'Outbreak of Ukraine war triggers historic European natural gas surges and grain export sanctions.',
    },
    2023: {
      energyIndex: 76,
      inflation: 5.8,
      supplyChainDisruption: 64,
      foodIndex: 82,
      summary: 'Aggressive central bank rate hikes begin cooling commodity spirals with re-routed supply lanes.',
    },
  };

  const runUpiSimulation = (type: 'safe' | 'fraud' | 'high_value') => {
    setSimTxnType(type);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      if (type === 'safe') {
        setScanResult({
          score: Math.floor(Math.random() * 12) + 8,
          status: 'APPROVED',
          flags: ['Device Fingerprint Matched', 'Biometric Auth Verified', 'Velocity: 1 txn/hr'],
          latency: Math.floor(Math.random() * 15) + 32,
        });
      } else if (type === 'high_value') {
        setScanResult({
          score: 58,
          status: 'CHALLENGE',
          flags: ['High Amount (₹75,000)', 'New Device MAC', 'Step-up OTP Required'],
          latency: 44,
        });
      } else {
        setScanResult({
          score: 94,
          status: 'FLAGGED',
          flags: ['Velocity Spike: 14 txns/min', 'Impossible Geolocation Travel (Mumbai -> London)', 'Known Mule Account UPI ID'],
          latency: 29,
        });
      }
    }, 650);
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 border-t border-stone-200/80 bg-stone-50/40">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-8">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>03 // Flagship Works</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-2">
            Featured Projects
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Engineered by Soumadip Das • Tejas India Hackathon Winner (Team Lead) & Quantitative Research.
          </p>
        </div>

        {/* Two Flagship Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.slice(0, 2).map((project, idx) => {
            const isUpiProject = project.title.toLowerCase().includes('upi') || idx === 0;
            const isWarProject = project.title.toLowerCase().includes('war') || project.title.toLowerCase().includes('ripple') || idx === 1;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="group flex flex-col rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 overflow-hidden transition-all duration-300"
              >
                {/* Media Container with Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                  {playingVideoId === project.id && project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      controls
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={project.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';
                        }}
                      />

                      {/* Hackathon Ribbon for UPI Project */}
                      {isUpiProject && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold font-mono shadow-md border border-amber-300">
                          <Award className="w-3.5 h-3.5 fill-current" />
                          <span>Tejas India Hackathon Winner 🏆</span>
                        </div>
                      )}

                      {/* Research Tag for War Project */}
                      {isWarProject && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-semibold font-mono shadow-md">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Macroeconomic Research</span>
                        </div>
                      )}

                      {/* Category tag on right */}
                      {project.category && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-mono font-medium shadow-xs">
                          {project.category}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200/80 text-stone-700 text-[11px] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Animated Feature Buttons */}
                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      {isUpiProject && (
                        <button
                          onClick={() => setShowUpiSim(!showUpiSim)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{showUpiSim ? 'Close Live Risk Simulator' : 'Test Live UPI Threat Simulator'}</span>
                        </button>
                      )}

                      {isWarProject && (
                        <button
                          onClick={() => setShowEconExplorer(!showEconExplorer)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>{showEconExplorer ? 'Close Economic Explorer' : 'Explore Macroeconomic Data (2020-2023)'}</span>
                        </button>
                      )}

                      {/* External Links */}
                      <div className="flex items-center gap-4 pt-1">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                          >
                            <span>Live Preview</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Source Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* INTERACTIVE MODULE 1: Live UPI Fraud Telemetry Simulator */}
        <AnimatePresence>
          {showUpiSim && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-950 text-white border border-stone-800 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>SecureFlow AI: Live UPI Risk Assessment Simulator</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Smart India Hackathon Winner
                        </span>
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Simulate real-time payment packets and watch the anomaly detection engine calculate risk in &lt;50ms.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowUpiSim(false)}
                    className="text-xs text-stone-400 hover:text-white font-mono cursor-pointer"
                  >
                    [ Close Simulator ]
                  </button>
                </div>

                {/* Simulation Scenario Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => runUpiSimulation('safe')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      simTxnType === 'safe'
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-md'
                        : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">Scenario A: Normal Payment</span>
                    <span className="text-[11px] text-stone-400 block mt-1">₹450 • Trusted Device • Known Merchant</span>
                  </button>

                  <button
                    onClick={() => runUpiSimulation('high_value')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      simTxnType === 'high_value'
                        ? 'bg-amber-950/70 border-amber-500 shadow-md'
                        : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">Scenario B: High-Value Anomaly</span>
                    <span className="text-[11px] text-stone-400 block mt-1">₹75,000 • New Hardware MAC • Late Night</span>
                  </button>

                  <button
                    onClick={() => runUpiSimulation('fraud')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      simTxnType === 'fraud'
                        ? 'bg-red-950/70 border-red-500 shadow-md'
                        : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">Scenario C: Rapid Velocity Drain</span>
                    <span className="text-[11px] text-stone-400 block mt-1">14 txns/min • Geo-Hop • Mule Account</span>
                  </button>
                </div>

                {/* Real-time Telemetry Dashboard Result */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Gauge Display */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      {isScanning ? (
                        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-stone-800"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={
                                scanResult.score > 70
                                  ? 'text-red-500'
                                  : scanResult.score > 40
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }
                              strokeDasharray={`${scanResult.score}, 100`}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-xl font-bold font-mono text-white block">{scanResult.score}</span>
                            <span className="text-[9px] font-mono text-stone-400 uppercase">Risk</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase block">Engine Decision</span>
                      <div className="flex items-center gap-2 mt-1">
                        {scanResult.status === 'APPROVED' && (
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono inline-flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            TRANSACTION APPROVED
                          </span>
                        )}
                        {scanResult.status === 'CHALLENGE' && (
                          <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono inline-flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4" />
                            CHALLENGE (OTP STEP-UP)
                          </span>
                        )}
                        {scanResult.status === 'FLAGGED' && (
                          <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold font-mono inline-flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4" />
                            TRANSACTION BLOCKED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-stone-400 block mt-1">
                        Inference Latency: <strong className="text-emerald-400">{scanResult.latency} ms</strong> (FastAPI + SQL Engine)
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Flags */}
                  <div className="flex-1 max-w-sm space-y-1.5">
                    <span className="text-[11px] font-mono text-stone-400 block">Telemetry Flags Evaluated:</span>
                    {scanResult.flags.map((flag, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-stone-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE MODULE 2: Global Ripple Effects Macroeconomic Explorer */}
        <AnimatePresence>
          {showEconExplorer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-300 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-stone-900 text-white">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900">
                        Global Ripple Effects: War Economic Impact Analysis (2020–2023)
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Interactive econometric metric explorer built from trade data, commodity spikes, and supply chain telemetry.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEconExplorer(false)}
                    className="text-xs text-stone-500 hover:text-stone-900 font-mono cursor-pointer"
                  >
                    [ Close Explorer ]
                  </button>
                </div>

                {/* Year Selectors */}
                <div className="flex items-center gap-2 mb-6">
                  {([2020, 2021, 2022, 2023] as const).map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedYear === year
                          ? 'bg-stone-900 text-white shadow-md'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                {/* Metrics Breakdown Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                      <span>Energy Price Shock Index</span>
                      <span className="font-mono text-emerald-700 font-bold">{econData[selectedYear].energyIndex} / 100</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${econData[selectedYear].energyIndex}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-emerald-600 h-2.5 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                      <span>Global Inflation Rate</span>
                      <span className="font-mono text-red-600 font-bold">{econData[selectedYear].inflation}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(econData[selectedYear].inflation / 10) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-red-500 h-2.5 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                      <span>Supply Chain Disruption Pressure</span>
                      <span className="font-mono text-amber-700 font-bold">{econData[selectedYear].supplyChainDisruption} / 100</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${econData[selectedYear].supplyChainDisruption}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-amber-500 h-2.5 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                      <span>Food Commodity Index</span>
                      <span className="font-mono text-stone-900 font-bold">{econData[selectedYear].foodIndex} / 100</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${econData[selectedYear].foodIndex}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-stone-800 h-2.5 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-stone-700">
                  <span className="font-bold text-emerald-900 block mb-1">Key Research Takeaway ({selectedYear}):</span>
                  <p className="leading-relaxed">{econData[selectedYear].summary}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
