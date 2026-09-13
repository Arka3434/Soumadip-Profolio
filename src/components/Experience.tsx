import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';
import { downloadResumePdf } from '../utils/generatePdf';

interface ExperienceProps {
  data: PortfolioData;
  onOpenResume?: () => void;
}

export const Experience: React.FC<ExperienceProps> = ({ data, onOpenResume }) => {
  return (
    <section id="experience" className="py-20 px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Section Header / Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-700 mb-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            /EXPERIENCE
          </h2>
          <span className="text-gray-400 text-sm md:text-base font-mono">
            9+ years of experience
          </span>
        </div>

        {/* Experience List Layout */}
        <div className="divide-y divide-gray-700">
          {data.experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="py-6 first:pt-4 last:border-b-0"
            >
              {/* Header: Company Name & Period */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-white font-bold text-lg">
                  {exp.company}
                </h3>
                <span className="text-gray-400 text-sm font-mono shrink-0">
                  {exp.period}
                </span>
              </div>

              {/* Role */}
              <div className="text-gray-300 text-base font-medium mt-0.5">
                {exp.role}
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mt-2">
                {exp.description}
              </p>

              {/* Skills */}
              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-2.5 text-xs text-gray-400">
                  <span className="text-gray-500 font-medium">Skills: </span>
                  <span>{exp.skills.join(', ')}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Education Sub-Section */}
        {data.educations && data.educations.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-700 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                /EDUCATION
              </h2>
              <span className="text-gray-400 text-sm font-mono">
                Academic Qualifications ({data.educations.length})
              </span>
            </div>

            <div className="divide-y divide-gray-700">
              {data.educations.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="py-6 first:pt-4 last:border-b-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-white font-bold text-lg">
                      {edu.institution}
                    </h3>
                    <span className="text-gray-400 text-sm font-mono shrink-0">
                      {edu.period}
                    </span>
                  </div>

                  <div className="text-gray-300 text-base font-medium mt-0.5">
                    {edu.degree}
                  </div>

                  {edu.score && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-mono font-medium">
                        {edu.score}
                      </span>
                    </div>
                  )}

                  {edu.details && (
                    <p className="text-gray-400 text-sm leading-relaxed mt-2">
                      {edu.details}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Sub-Section */}
        {data.certifications && data.certifications.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-700 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                /CERTIFICATIONS
              </h2>
              <span className="text-gray-400 text-sm font-mono">
                Industry Credentials & Simulations ({data.certifications.length})
              </span>
            </div>

            <div className="divide-y divide-gray-700">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 last:border-b-0">
                  <div>
                    <h4 className="text-white font-bold text-base">
                      {cert.name}
                    </h4>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                  {cert.year && (
                    <span className="text-gray-400 text-sm font-mono shrink-0">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume Download Action */}
        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center sm:text-left">
            Download or print Soumadip Das's official resume with coursework, verified scores & hackathon records.
          </p>
          <button
            onClick={() => {
              downloadResumePdf(data);
              if (onOpenResume) {
                onOpenResume();
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            title="Download Soumadip Das Resume (PDF)"
          >
            <Download className="w-4 h-4" />
            <span>Download CV (PDF)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
