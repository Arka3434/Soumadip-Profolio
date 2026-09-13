import React from 'react';
import { Layers, Sparkles, Terminal, Database, BrainCircuit, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';

interface SkillsProps {
  data: PortfolioData;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Programming Languages': <Terminal className="w-4 h-4 text-emerald-600" />,
  'Databases & Query Optimization': <Database className="w-4 h-4 text-blue-600" />,
  'AI, Data & Specialized': <BrainCircuit className="w-4 h-4 text-amber-600" />,
  'Development Tools & CS Fundamentals': <Wrench className="w-4 h-4 text-purple-600" />,
};

export const Skills: React.FC<SkillsProps> = ({ data }) => {
  return (
    <section id="skills" className="py-20 px-4 sm:px-6 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
            02 // Technical Arsenal
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mt-2">
            Skills & Tech Stack
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
            Core competencies across software engineering, machine learning pipelines, relational databases, and quantitative analysis.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.skills.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-4">
                {CATEGORY_ICONS[group.name] || <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                <h3 className="font-bold text-black text-base tracking-tight">
                  {group.name}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 text-xs font-mono hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
