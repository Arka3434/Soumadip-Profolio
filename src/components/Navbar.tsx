import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Download, FileText } from 'lucide-react';
import { PortfolioData } from '../types';
import { downloadResumePdf } from '../utils/generatePdf';

interface NavbarProps {
  data: PortfolioData;
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ data, onOpenResume }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleResumeClick = () => {
    downloadResumePdf(data);
    if (onOpenResume) {
      onOpenResume();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Reel', href: '#video-reel' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Name */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-stone-900 font-bold text-base sm:text-lg tracking-tight group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-300/80 flex items-center justify-center text-emerald-800 font-mono text-sm font-bold group-hover:scale-105 transition-transform">
            {data.name.charAt(0) || 'P'}
          </div>
          <span className="font-semibold tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
            {data.name}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Controls in Light Palette */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={handleResumeClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:border-emerald-500 rounded-lg hover:text-emerald-800 transition-colors cursor-pointer shadow-xs"
            title="Download Soumadip Das Resume PDF directly"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resume (PDF)</span>
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Controls Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleResumeClick}
            className="p-1.5 text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg"
            title="Download CV (PDF)"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-stone-200 px-5 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-2 text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleResumeClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download Resume (PDF)
            </button>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                handleNavClick('#contact');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
