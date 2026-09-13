import { jsPDF } from 'jspdf';
import { PortfolioData } from '../types';

export function downloadResumePdf(data: PortfolioData): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = 45;

    // Helper: add horizontal rule
    const addDivider = (color = [200, 205, 212]) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.8);
      doc.line(margin, y, margin + contentWidth, y);
      y += 14;
    };

    // Helper: Section Title
    const addSectionHeader = (title: string) => {
      if (y > 740) {
        doc.addPage();
        y = 45;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(5, 122, 85); // Emerald-700
      doc.text(title.toUpperCase(), margin, y);
      y += 5;
      addDivider([16, 185, 129]);
    };

    // Header: Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(24, 24, 27); // Stone-900
    doc.text(data.name.toUpperCase(), margin, y);
    y += 18;

    // Subtitle / Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(75, 85, 99);
    doc.text('B.Tech in Information Technology  |  Tejas India Hackathon Winner 2026', margin, y);
    y += 15;

    // Contact Information Bar
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    const contactLine1 = `Email: ${data.email}   |   Phone: ${data.phone || '+91-7547949426'}   |   Location: ${data.location || 'Haldia, West Bengal, India'}`;
    doc.text(contactLine1, margin, y);
    y += 12;

    const contactLine2 = `LinkedIn: linkedin.com/in/soumadip-das-8837293a1/   |   GitHub: github.com/soumadip-engage`;
    doc.text(contactLine2, margin, y);
    y += 14;

    addDivider();

    // 1. PROFESSIONAL SUMMARY
    addSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    const summaryText =
      'Dedicated Information Technology undergraduate at Haldia Institute of Technology maintaining a 9.16 CGPA. Tejas India Hackathon Winner and Team Lead on SecureFlow AI (real-time UPI fraud monitoring & anomaly detection system). Hands-on proficiency in Python, SQL/SQLite, Java, C/C++, Generative AI, Power BI, and Data Structures & Algorithms. Active Research Assistant at NSRI with strong problem-solving and software engineering leadership.';
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 12 + 10;

    // 2. EDUCATION
    addSectionHeader('Education');
    const educationList = [
      {
        inst: 'Haldia Institute of Technology (HIT)',
        degree: 'Bachelor of Technology (B.Tech) — Information Technology (IT)',
        period: '2025 – Present',
        score: 'CGPA: 9.16 (1st Yr: 9.15 | 2nd Yr: 9.16)',
        desc: 'Key Coursework: Data Structures & Algorithms, Object Oriented Programming, DBMS, Operating Systems, Computer Networks, Software Engineering.',
      },
      {
        inst: 'Shimlapal Madan Mohan High School (SMMHS)',
        degree: 'Higher Secondary (Class XII) — Science Stream (WBCHSE)',
        period: '2024 – 2025',
        score: 'Distinction Score: 93%',
        desc: 'Specialized in Physics, Chemistry, Mathematics, and Computer Science.',
      },
      {
        inst: 'Amlasuli Indra Narayan High School (AINHS)',
        degree: 'Secondary Examination (Class X) — WBBSE Board',
        period: '2022 – 2023',
        score: 'High Academic Distinction: 92%',
        desc: 'Foundational mathematics, physical sciences, and academic honors.',
      },
    ];

    educationList.forEach((edu) => {
      if (y > 750) {
        doc.addPage();
        y = 45;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text(edu.inst, margin, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 122, 85);
      doc.text(edu.score, margin + contentWidth - doc.getTextWidth(edu.score), y);
      y += 12;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(`${edu.degree}  (${edu.period})`, margin, y);
      y += 11;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      const splitEduDesc = doc.splitTextToSize(edu.desc, contentWidth);
      doc.text(splitEduDesc, margin, y);
      y += splitEduDesc.length * 10 + 8;
    });

    // 3. KEY PROJECTS & HACKATHONS
    addSectionHeader('Featured Projects & Hackathons');

    const projectsList = [
      {
        name: 'UPI Fraud Detection & Prevention System (SecureFlow AI)',
        badge: 'Tejas India Hackathon Winner 🏆 & Team Lead',
        points: [
          'Engineered a real-time transaction monitoring platform in Python with an optimized SQLite/SQL relational database layer.',
          'Formulated anomaly detection logic tracking rapid velocity spikes, geo-mismatches, and anomalous token requests in < 85ms.',
          'Built web telemetry dashboards with live transaction logs, fraud categorization, balance auditing, and security triggers.',
          'Led end-to-end architecture, database schema design, and presentation before national hackathon jury to win 1st Place.',
        ],
      },
      {
        name: 'Global Ripple Effects: Economic Impact of War (2020–2023)',
        badge: 'Macroeconomic & Analytics Research',
        points: [
          'Researched geopolitical shocks across international markets, commodities, currency values, and energy supply chains.',
          'Compiled, standardized, and cleansed large longitudinal datasets using Microsoft Excel and statistical methods.',
          'Constructed interactive multi-factor analytics models in Microsoft Power BI visualizing historical inflation fluctuations.',
        ],
      },
    ];

    projectsList.forEach((proj) => {
      if (y > 730) {
        doc.addPage();
        y = 45;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text(proj.name, margin, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9); // Amber
      doc.text(proj.badge, margin + contentWidth - doc.getTextWidth(proj.badge), y);
      y += 12;

      proj.points.forEach((pt) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(55, 65, 81);
        const splitPt = doc.splitTextToSize(`•  ${pt}`, contentWidth - 8);
        doc.text(splitPt, margin + 4, y);
        y += splitPt.length * 11;
      });
      y += 6;
    });

    // Page 2 or Page boundary
    if (y > 620) {
      doc.addPage();
      y = 45;
    }

    // 4. PROFESSIONAL EXPERIENCE & ROLES
    addSectionHeader('Experience & Roles');
    const experiences = [
      {
        role: 'Research Assistant',
        org: 'National Student Research Institution (NSRI)',
        period: 'Jun 2026 – Present',
        desc: 'Engaging in academic computing research, algorithm analysis, literature synthesis, and peer-reviewed documentation.',
      },
      {
        role: 'Full Stack Engineer (Freelance)',
        org: 'micro1',
        period: 'May 2026 – Present',
        desc: 'Developing scalable web application modules, API integrations, responsive interfaces, and test-driven components.',
      },
      {
        role: 'AI Data Trainer',
        org: 'Handshake',
        period: 'May 2026 – Present',
        desc: 'Evaluating AI generation accuracy, performing model response benchmarking, and curating domain training datasets.',
      },
      {
        role: 'AI Specialist',
        org: 'Outlier AI',
        period: 'Apr 2026 – Present',
        desc: 'Executing RLHF evaluations, code reasoning validation, and prompt complexity stress-testing for state-of-the-art LLMs.',
      },
      {
        role: 'Digital Marketing Intern & Campus Ambassador',
        org: 'International Model United Nations (IMUN)',
        period: 'Apr 2025 – Jul 2026',
        desc: 'Conducted national delegate outreach, led digital engagement campaigns, and awarded Certificate of Excellence.',
      },
    ];

    experiences.forEach((exp) => {
      if (y > 755) {
        doc.addPage();
        y = 45;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text(`${exp.role} — ${exp.org}`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(exp.period, margin + contentWidth - doc.getTextWidth(exp.period), y);
      y += 11;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(55, 65, 81);
      const splitDesc = doc.splitTextToSize(exp.desc, contentWidth);
      doc.text(splitDesc, margin, y);
      y += splitDesc.length * 10 + 6;
    });

    // 5. TECHNICAL SKILLS
    addSectionHeader('Technical Skills & Competencies');
    const skillCategories = [
      { cat: 'Languages', items: 'Python, Java, C, C++, SQL, JavaScript, HTML5/CSS3' },
      { cat: 'Databases & Systems', items: 'DBMS, SQLite, SQL Schema Optimization, Relational Modeling' },
      { cat: 'AI & Data Analysis', items: 'Generative AI, Prompt Engineering, Microsoft Power BI, Statistical Analytics' },
      { cat: 'Tools & CS Core', items: 'Git & GitHub, VS Code, Linux/Bash, OOP, DSA, Software Architecture' },
    ];

    skillCategories.forEach((sc) => {
      if (y > 760) {
        doc.addPage();
        y = 45;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(17, 24, 39);
      doc.text(`${sc.cat}:`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(55, 65, 81);
      doc.text(sc.items, margin + 115, y);
      y += 12;
    });
    y += 6;

    // 6. CERTIFICATIONS & HONORS
    addSectionHeader('Key Certifications & Honors');
    const certs = [
      'Tejas India Hackathon Winner 2026 — Team Lead, SecureFlow AI (1st Place)',
      'Google Cloud Gen AI Academy 2.0 Certification',
      'Google Cloud Arcade Guide 2026 Workshop',
      'Deloitte Cyber Job Simulation — Forage',
      'Goldman Sachs Operations Job Simulation — Forage',
      'Certificate of Excellence — Campus Outreach & Leadership (IMUN)',
    ];

    certs.forEach((cert) => {
      if (y > 765) {
        doc.addPage();
        y = 45;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(55, 65, 81);
      doc.text(`✓   ${cert}`, margin + 4, y);
      y += 11;
    });

    // Save and trigger file download
    doc.save('Soumadip_Das_Resume.pdf');
  } catch (err) {
    console.error('Failed to generate PDF with jsPDF', err);
    // Fallback: download the static copy
    const link = document.createElement('a');
    link.href = '/Soumadip_Das_Resume.pdf';
    link.download = 'Soumadip_Das_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
