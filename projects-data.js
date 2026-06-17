// projects-data.js
// This file defines an array of project metadata used to dynamically generate project cards on projects.html.
// Each object contains the GitHub repository (owner/repo) where the preview image `project.webp` lives,
// as well as display information for the card.

const projects = [
  {
    repo: "arjundevloper/portfolio",
    title: "Portfolio v2",
    tag: "Web / Interactive",
    desc: "This very site — a dark, motion-rich portfolio with a premium aurora glow system and full responsive layout.",
    date: "2025",
    link: "#",
    linkText: "View →",
    linkTarget: false
  },
  {
    repo: "arjundevloper/portfolio",
    title: "Project Untitled",
    tag: "Game / Design",
    desc: "A vibe-coded game concept blending generative visuals with custom game mechanics. Work in progress.",
    date: "2025",
    link: "#",
    linkText: "Coming Soon",
    linkTarget: false
  },
  {
    repo: "arjundevloper/portfolio",
    title: "Motion Toolkit",
    tag: "Tool / Utility",
    desc: "A collection of reusable animation utilities and micro-interaction patterns built for web projects.",
    date: "2024",
    link: "https://github.com/arjundevloper",
    linkText: "GitHub →",
    linkTarget: true
  },
  {
    repo: "arjundevloper/motion-detection-desktop-switcher",
    title: "Design System",
    tag: "UI / Frontend",
    desc: "A personal component library with dark-mode-first tokens, consistent spacing, and typographic scale.",
    date: "2024",
    link: "#",
    linkText: "View →",
    linkTarget: false
  },
  {
    repo: "arjundevloper/portfolio",
    title: "Discord Bot",
    tag: "Bot / Automation",
    desc: "A multi-feature Discord bot with moderation, music, and custom commands deployed for a community server.",
    date: "2024",
    link: "https://github.com/arjundevloper",
    linkText: "GitHub →",
    linkTarget: true
  },
  {
    repo: "arjundevloper/portfolio",
    title: "Generative Art Engine",
    tag: "Experiment",
    desc: "Canvas-based generative art experiments using noise fields, particle systems, and procedural color.",
    date: "2024",
    link: "#",
    linkText: "View →",
    linkTarget: false
  }
];
