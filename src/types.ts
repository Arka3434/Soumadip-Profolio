export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  featured?: boolean;
  category?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  score?: string;
  details?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface Organization {
  id: string;
  role: string;
  organization: string;
  period: string;
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

export interface VideoShowcase {
  enabled: boolean;
  title: string;
  subtitle: string;
  videoUrl?: string;
  posterUrl?: string;
  mode?: 'interactive' | 'custom';
  narrationText?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  avatarUrl: string;
  status: string;
  bio: string[];
  voiceIntroText: string;
  email: string;
  phone?: string;
  location: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  videoShowcase: VideoShowcase;
  skills: SkillGroup[];
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  certifications?: Certification[];
  organizations?: Organization[];
  resumeUrl?: string;
}
