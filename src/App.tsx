import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoSection } from './components/VideoSection';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { PortfolioData } from './types';
import { defaultPortfolioData } from './data/defaultData';
import { getStoredAvatar, getStoredVoiceAudio } from './utils/mediaStorage';

export default function App() {
  const [data] = useState<PortfolioData>(() => {
    const stored = getStoredAvatar();
    if (stored) {
      return {
        ...defaultPortfolioData,
        avatarUrl: stored,
        videoShowcase: defaultPortfolioData.videoShowcase
          ? { ...defaultPortfolioData.videoShowcase, posterUrl: stored }
          : undefined,
      };
    }
    return defaultPortfolioData;
  });
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Synchronize stored avatar and voice to persistent server storage on load
  useEffect(() => {
    const syncPersistedMedia = async () => {
      try {
        const avatar = getStoredAvatar();
        const voice = await getStoredVoiceAudio();
        if (avatar || voice) {
          await fetch('/api/sync-media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar, voice }),
          });
        }
      } catch (err) {
        console.warn('Persisted media sync check:', err);
      }
    };

    syncPersistedMedia();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      {/* Fixed Navbar with Resume and Contact Links */}
      <Navbar
        data={data}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content Sections (Locked Read-Only for Public Sharing) */}
      <main>
        {/* 1. Hero Section with Typewriter, Authentic Voice Narration & Light styling */}
        <Hero
          data={data}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 2. Video Showreel & Motion Showcase */}
        {data.videoShowcase?.enabled && (
          <VideoSection
            showcase={data.videoShowcase}
            data={data}
          />
        )}

        {/* 3. About Section with Voice Read-Aloud */}
        <About
          data={data}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 4. Skills & Expertise */}
        <Skills
          data={data}
        />

        {/* 5. Featured Projects with Live Simulator */}
        <Projects
          data={data}
        />

        {/* 6. Experience & Education Timeline */}
        <Experience
          data={data}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 7. Contact Section with Verified Channels */}
        <Contact
          data={data}
        />
      </main>

      {/* Footer */}
      <Footer data={data} />

      {/* Official Verified Resume / CV Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        data={data}
      />
    </div>
  );
}
