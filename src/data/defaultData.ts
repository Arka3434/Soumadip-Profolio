import { PortfolioData } from '../types';

export const defaultPortfolioData: PortfolioData = {
  name: 'Soumadip Das',
  title: 'B.Tech IT Scholar, 1× Hackathon Winner & AI Developer',
  tagline: 'Tejas India Hackathon Winner (Team Lead, SecureFlow AI) | Information Technology scholar at Haldia Institute of Technology (9.16 CGPA) | Research Assistant at NSRI | AI & Full-Stack Developer.',
  avatarUrl: '/profile.jpg',
  status: '1× Hackathon Winner • Open for Opportunities',
  bio: [
    "I’m **Soumadip Das**, an Information Technology student and **AI & Software Developer** passionate about building practical, intelligent, and impactful technology solutions. As a **1× Hackathon Winner**, I enjoy turning ideas into working products through problem-solving, software development, AI, and data-driven technologies.",
    "I have hands-on experience with **Python, Java, C/C++, SQL, SQLite, HTML, CSS, JavaScript, Git, GitHub, Power BI, and Generative AI**. My project experience includes **SecureFlow AI**, an AI-powered UPI fraud detection and prevention platform developed for a national-level hackathon.",
    "Beyond development, I have experience in **AI training, research, digital marketing, community engagement, and team leadership**. I’m continuously learning, experimenting with new technologies, and looking for opportunities to build solutions that solve real-world problems.",
    "**Currently focused on:** AI • Software Development • Cybersecurity • FinTech • Data & Analytics • Generative AI"
  ],
  voiceIntroText: "Hi, I am Soumadip Das, an Information Technology student and AI and software developer, passionate about building practical, intelligent, and impactful technology solutions. As a 1x hackathon winner, I enjoy turning ideas into working products through problem solving, software development, AI, and data-driven technologies. I have hands-on experience with Python, Java, C, C++, SQL, SQLite, HTML, CSS, JavaScript, Git, GitHub, Power BI, and Generative AI. My project experience includes SecureFlow AI, an AI-powered UPI fraud detection system and prevention platform developed for a national level hackathon. Beyond development, I have experience in AI training, research, digital marketing, community engagement, and team leadership. I am continuously learning, experimenting with new technologies, and looking for opportunities to build solutions that solve real-world problems.",
  email: 'soumadipd43@gmail.com',
  phone: '+91-7547949426',
  location: 'Haldia, West Bengal, India',
  social: {
    github: 'https://github.com/soumadip-engage',
    linkedin: 'https://www.linkedin.com/in/soumadip-das-8837293a1/',
    twitter: 'https://x.com/das_debu72623',
    website: 'https://soumadip-engage.github.io',
  },
  videoShowcase: {
    enabled: true,
    mode: 'interactive',
    title: 'Soumadip Das — Interactive Profile & Work Showreel',
    subtitle: 'A cinematic journey exploring hackathon leadership, academic excellence, NSRI research, and live project architectures.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: '/profile.jpg',
    narrationText: "Welcome! I am Soumadip Das, pursuing B.Tech in Information Technology at Haldia Institute of Technology with a 9.16 CGPA. As Tejas India Hackathon Winner and Team Lead on SecureFlow AI, I engineered our real-time UPI Fraud Monitoring system. Explore my research at NSRI and professional experience."
  },
  skills: [
    {
      name: 'Programming Languages',
      skills: ['Python', 'Java', 'C', 'C++', 'SQL', 'JavaScript', 'HTML/CSS']
    },
    {
      name: 'Databases & Query Optimization',
      skills: ['DBMS', 'SQLite', 'SQL Schema Design', 'Query Optimization', 'Relational Modeling']
    },
    {
      name: 'AI, Data & Specialized',
      skills: ['Generative AI', 'Power BI', 'Data Analysis', 'Prompt Engineering', 'Statistical Research', 'Threat Telemetry']
    },
    {
      name: 'Development Tools & CS Fundamentals',
      skills: ['Git & GitHub', 'VS Code', 'Microsoft Excel', 'Data Structures & Algorithms', 'OOP', 'Operating Systems', 'Software Engineering']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'UPI Fraud Detection System (SecureFlow AI)',
      description: 'Built for the Tejas India Hackathon 2026 as Team Lead (Winner). Real-time UPI transaction fraud-monitoring platform using a Python backend and SQLite/SQL database layer. Features live web dashboards for transaction telemetry, fraud alerts, balance tracking, administration, and anomaly detection algorithms.',
      tags: ['Python', 'SQL', 'SQLite', 'FastAPI', 'Cybersecurity', 'Machine Learning', 'Threat Telemetry'],
      liveUrl: '#live-demo',
      githubUrl: 'https://github.com/soumadip-engage',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
      featured: true,
      category: 'AI & Cybersecurity'
    },
    {
      id: 'proj-2',
      title: 'Global Ripple Effects - Economic Impact of War (2020-2023)',
      description: 'Independent Quantitative Research project. Analyzes economic shocks of global conflicts (2020–2023) across inflation, energy prices, food commodities, trade flows, and financial markets. Features interactive Power BI dashboards and analytical models communicating multi-year macroeconomic trends.',
      tags: ['Power BI', 'Python', 'Microsoft Excel', 'Data Analysis', 'Macroeconomics', 'Statistical Research'],
      liveUrl: '#economic-demo',
      githubUrl: 'https://github.com/soumadip-engage',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      featured: true,
      category: 'Data Analytics & Economics'
    }
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Team Lead (Hackathon Winner 🏆)',
      company: 'Tejas India Hackathon 2026',
      period: 'Sep 2026 – Present',
      description: 'Built a real-time UPI transaction fraud-monitoring platform with a Python backend and SQLite/SQL database layer. Developed web dashboards for live transaction monitoring, fraud alerts, analytics, balance monitoring, administration, and security. Designed relational schemas and SQL queries to identify anomalous patterns and led the solution as Team Lead.',
      skills: ['Python', 'SQLite', 'SQL', 'JavaScript', 'HTML/CSS', 'Git/GitHub', 'Team Lead']
    },
    {
      id: 'exp-2',
      role: 'Research Assistant',
      company: 'National Student Research Institution (NSRI)',
      period: 'Jun 2026 – Present',
      description: 'Conduct literature reviews and research-data collection for scientific and technical projects. Support quantitative/qualitative analysis, documentation, and systematic research reporting. Collaborate with interdisciplinary teams on academic research objectives.',
      skills: ['Scientific Research', 'Qualitative Analysis', 'Literature Review', 'Systematic Reporting']
    },
    {
      id: 'exp-3',
      role: 'Digital Marketing Intern & Campus Ambassador',
      company: 'International Model United Nations (IMUN)',
      period: 'Apr 2025 – Jul 2026',
      description: 'Promoted global youth conferences and educational programs through digital outreach and campus campaigns. Supported student registrations and campaign initiatives; received Certificate of Excellence.',
      skills: ['Digital Outreach', 'Youth Conferences', 'Campaign Strategy', 'Certificate of Excellence']
    },
    {
      id: 'exp-4',
      role: 'Campus Representative — Summer of Code 2026',
      company: 'Elite Coders',
      period: 'May 2026 – Jun 2026',
      description: 'Represented Haldia Institute of Technology and promoted competitive coding, open-source culture, and peer learning. Managed student registrations and supported technical community activities.',
      skills: ['Competitive Coding', 'Open Source', 'Summer of Code', 'Student Engagement']
    },
    {
      id: 'exp-5',
      role: 'Campus Ambassador',
      company: 'Paytm Campus',
      period: 'May 2026 – Jun 2026',
      description: 'Supported campus-level digital payment awareness, student engagement, and fintech outreach.',
      skills: ['Fintech Outreach', 'Digital Payments', 'Student Engagement', 'Brand Awareness']
    },
    {
      id: 'exp-6',
      role: 'Campus Ambassador',
      company: 'Cloud Junction',
      period: 'Jul 2026 – Present',
      description: 'Promote cloud and technical learning programs, workshops, hackathons, and bootcamps among students.',
      skills: ['Cloud Awareness', 'Technical Workshops', 'Hackathon Promotion', 'Bootcamps']
    },
    {
      id: 'exp-7',
      role: 'Brand Ambassador',
      company: 'launchED Global',
      period: 'Jun 2026 – Present',
      description: 'Promote career-focused technical initiatives and increase student awareness and participation.',
      skills: ['Career Initiatives', 'Student Outreach', 'Brand Advocacy']
    },
    {
      id: 'exp-8',
      role: 'Full Stack Engineer (Freelance)',
      company: 'micro1',
      period: 'May 2026 – Present',
      description: 'Delivering reliable application architectures, modular front-end interfaces, and high-performance server logic.',
      skills: ['Full Stack', 'Web Development', 'API Architecture', 'Software Engineering']
    },
    {
      id: 'exp-9',
      role: 'AI Data Trainer (Freelance)',
      company: 'Handshake',
      period: 'Apr 2026 – Present',
      description: 'Model-related evaluation, validation standards, and quality verification for intelligent systems.',
      skills: ['AI Evaluation', 'Model Validation', 'Prompt Engineering', 'Quality Standards']
    },
    {
      id: 'exp-10',
      role: 'AI Training Specialist (Freelance)',
      company: 'Outlier AI',
      period: 'Jan 2026 – Present',
      description: 'Advanced AI training, quality auditing, and reasoning alignment for cutting-edge foundational models.',
      skills: ['RLHF', 'Reasoning Alignment', 'AI Training', 'Quality Auditing']
    }
  ],
  educations: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Information Technology (IT)',
      institution: 'Haldia Institute of Technology (HIT), West Bengal',
      period: 'Sep 2025 – Present',
      score: 'CGPA: 9.15 (1st Year) | 9.16 (2nd Year)',
      details: 'Coursework: Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Software Engineering.'
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary (Class XII), Science',
      institution: 'Shimlapal Madan Mohan High School (SMMHS)',
      period: 'Jun 2024 – May 2025',
      score: 'Score: 93% Distinction',
      details: 'Distinction-level performance in science and mathematics. West Bengal Council of Higher Secondary Education.'
    },
    {
      id: 'edu-3',
      degree: 'Secondary Education (Class X)',
      institution: 'Amlasuli Indra Narayan High School (AINHS)',
      period: 'Jun 2022 – Mar 2023',
      score: 'Score: 92% Distinction',
      details: 'Strong academic performance in secondary board examination. West Bengal Board of Secondary Education.'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Tejas India Hackathon 2026',
      issuer: 'Team Lead, SecureFlow AI (Winner 🏆)',
      year: '2026'
    },
    {
      id: 'cert-2',
      name: 'Google Cloud Gen AI Academy 2.0',
      issuer: 'Google Cloud',
      year: '2026'
    },
    {
      id: 'cert-3',
      name: 'Google Cloud Arcade Guide 2026 Workshop',
      issuer: 'Google Cloud',
      year: '2026'
    },
    {
      id: 'cert-4',
      name: 'Deloitte Cyber Job Simulation',
      issuer: 'Deloitte (Forage)',
      year: '2025'
    },
    {
      id: 'cert-5',
      name: 'Goldman Sachs Operations Job Simulation',
      issuer: 'Goldman Sachs (Forage)',
      year: '2025'
    },
    {
      id: 'cert-6',
      name: 'Critical Thinking in the AI Era',
      issuer: 'HP LIFE',
      year: '2025'
    },
    {
      id: 'cert-7',
      name: 'Soft Skills and Presentation Skills',
      issuer: 'TCS iON',
      year: '2024'
    },
    {
      id: 'cert-8',
      name: 'Certificate of Excellence — Campus Ambassador & Outreach',
      issuer: 'IMUN (International Model United Nations)',
      year: '2024'
    }
  ],
  organizations: [
    {
      id: 'org-1',
      role: 'Hackathon Winner & Team Lead',
      organization: 'Tejas India Hackathon',
      period: '2026'
    },
    {
      id: 'org-2',
      role: 'Research Assistant',
      organization: 'National Student Research Institution (NSRI)',
      period: '2026 – Present'
    },
    {
      id: 'org-3',
      role: 'Campus Representative',
      organization: 'Elite Coders Summer of Code',
      period: '2026'
    },
    {
      id: 'org-4',
      role: 'Campus Ambassador',
      organization: 'Paytm',
      period: '2026'
    },
    {
      id: 'org-5',
      role: 'Campus Ambassador',
      organization: 'Cloud Junction',
      period: '2026'
    }
  ],
  resumeUrl: '#'
};
