import React from 'react';
import { ExternalLink, Github, Award, BarChart3, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';

interface ProjectsProps {
  data: PortfolioData;
}

export const Projects: React.FC<ProjectsProps> = ({ data }) => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>03 // Flagship Works</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mt-2">
            Featured Projects
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            Engineered by Soumadip Das • Tejas India Hackathon Winner (Team Lead) & Quantitative Research.
          </p>
        </div>

        {/* 2-Column Grid */}
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
                className="group flex flex-col rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6"
              >
                {/* Project Image */}
                <div className="relative w-full h-48 sm:h-56 rounded-md overflow-hidden bg-gray-100 mb-5">
                  <img
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';
                    }}
                  />

                  {/* Hackathon Ribbon for UPI Project */}
                  {isUpiProject && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-bold font-mono shadow-sm border border-amber-300">
                      <Award className="w-3.5 h-3.5 fill-current" />
                      <span>Tejas India Hackathon Winner 🏆</span>
                    </div>
                  )}

                  {/* Research Tag for War Project */}
                  {isWarProject && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-semibold font-mono shadow-sm">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Macroeconomic Research</span>
                    </div>
                  )}

                  {/* Category tag on right */}
                  {project.category && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-medium shadow-xs">
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Content Layout */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black group-hover:text-emerald-700 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Pill-shaped Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-xs font-mono font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Project Links */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
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
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
