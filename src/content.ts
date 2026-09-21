import {
  Award,
  Braces,
  Code2,
  Cpu,
  GraduationCap,
  Home,
  Send,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";

export const github = "https://github.com/Ameya5006";
export const linkedin = "https://www.linkedin.com/in/ameya-agarwal/";
export const navigation = [
  { id: "home", label: "Start", icon: Home },
  { id: "work", label: "Projects", icon: Braces },
  { id: "stack", label: "Toolkit", icon: Cpu },
  { id: "journey", label: "Journey", icon: Workflow },
  { id: "credentials", label: "Credentials", icon: Award },
  { id: "contact", label: "Connect", icon: Send },
];
export const projects = [
  {
    id: "gym",
    number: "01",
    title: "GymFlow",
    category: "FREELANCE · IN PRODUCTION",
    headline: "Two gyms.\nZero juggling.",
    description:
      "One platform for Fitness First Boxing Club and Nisha Fitness. Built to bring memberships, payments and day-to-day operations into one place.",
    highlights: [
      "Member + admin dashboards",
      "Sheets sync + WhatsApp reminders",
      "Firebase authentication + UPI",
    ],
    tags: ["React 19", "TypeScript", "Firebase", "Apps Script"],
    detail:
      "React 19 · TypeScript 6 · Vite 8 · Tailwind CSS · Firebase Auth · Firestore · Google Sheets API · Google Apps Script · WhatsApp notifications · UPI integration · Vercel",
    repo: "/Dual-gym-website",
    live: "https://boxingguruji.vercel.app/",
  },
  {
    id: "palm",
    number: "02",
    title: "PalmChef",
    category: "FULL-STACK · AI + INTERACTION",
    headline: "Good food.\nHands off.",
    description:
      "A kitchen assistant for the moments your hands are busy. Gesture controls, spoken recipes and AI assistance keep the cooking moving.",
    highlights: [
      "MediaPipe gesture navigation",
      "Gemini recipes + voice guidance",
      "Timers + offline PWA",
    ],
    tags: ["React 18", "MediaPipe", "Gemini", "MongoDB"],
    detail:
      "TypeScript · Vite · Tailwind CSS · Node.js · Express · MongoDB / Mongoose · JWT · bcrypt.js · CORS · Zustand · PDF.js · Web Speech API · Vitest · React Testing Library · Docker · Nginx · Render",
    repo: "/PalmChef",
    live: "https://palmchef-14qa.onrender.com",
  },
  {
    id: "amedic",
    number: "03",
    title: "Amedic",
    category: "FLUTTER · HEALTH TRACKER",
    headline: "Little habits.\nBigger picture.",
    description:
      "A pocket view of everyday wellbeing. Track movement, understand health calculations and turn scattered habits into visible progress.",
    highlights: [
      "Steps, goals + progress charts",
      "BMI/BMR, sleep + nutrition",
      "Shareable health summaries",
    ],
    tags: ["Flutter", "Dart", "pedometer", "fl_chart"],
    detail:
      "Flutter · Dart · pedometer · fl_chart · share_plus · Health calculations · Interactive charts · Flutter animations",
    repo: "/Amedic",
  },
  {
    id: "ocean",
    number: "04",
    title: "FloatChat",
    category: "FLUTTER · ARGO MOBILE",
    headline: "An ocean of data.\nA pocket explorer.",
    description:
      "Bring ARGO ocean data closer. Explore maps and ocean profiles, browse alerts, download data and try the conversational demo.",
    highlights: [
      "Interactive ocean maps",
      "Profiles, alerts + downloads",
      "Conversational demo",
    ],
    tags: ["Flutter", "Dart", "flutter_map", "latlong2"],
    detail:
      "Flutter · Dart · flutter_map · latlong2 · Map-based exploration · Ocean profiles · Alerts · Data downloads · Conversational demo",
    repo: "/FloatChat_app",
  },
];
export const toolkit = [
  {
    title: "Languages",
    items: [
      "Python",
      "Java",
      "C++",
      "TypeScript",
      "JavaScript",
      "Dart",
      "HTML",
      "CSS",
    ],
  },
  {
    title: "Interfaces",
    items: [
      "React 18 / 19",
      "Flutter",
      "Tailwind CSS",
      "Vite",
      "Framer Motion",
      "Zustand",
      "React Router",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Firebase Auth",
      "Firestore",
      "REST APIs",
      "JWT",
      "bcrypt.js",
      "CORS",
      "Zod",
    ],
  },
  {
    title: "AI / ML & APIs",
    items: [
      "Python",
      "NumPy",
      "pandas",
      "scikit-learn",
      "Classification",
      "Regression",
      "Model evaluation",
      "MLOps",
      "Gemini API",
      "MediaPipe",
      "Web Speech API",
      "Google Sheets API",
      "Apps Script",
    ],
  },
  {
    title: "Ship & test",
    items: [
      "Docker",
      "Nginx",
      "Vercel",
      "Render",
      "Git / GitHub",
      "Vitest",
      "React Testing Library",
      "ESLint",
      "Prettier",
      "PostCSS",
      "Nodemon",
      "VS Code",
    ],
  },
  {
    title: "App extras",
    items: [
      "PDF.js",
      "pedometer",
      "fl_chart",
      "share_plus",
      "flutter_map",
      "latlong2",
      "Flutter animations",
    ],
  },
];
export const experience = [
  {
    period: "MAR 2025 — MAR 2026",
    org: "ZARVA · EARLY-STAGE STARTUP",
    title: "Full-stack Developer",
    description:
      "Built and refined features for a Flutter mobile app, improving user experience and application performance in a collaborative startup team.",
    icon: Smartphone,
  },
  {
    period: "SEP 2024 — MAY 2025",
    org: "GEEKSFORGEEKS SOCIETY · BENNETT",
    title: "Core Team",
    description:
      "Helped run coding and tech events, wrote requirement documents, and coordinated technical, venue and participant needs.",
    icon: Code2,
  },
  {
    period: "AUG 2024 — AUG 2028",
    org: "BENNETT UNIVERSITY",
    title: "B.Tech · Computer Science",
    description:
      "Building across full-stack and Flutter while exploring AI/ML and strengthening DSA with C++.",
    icon: GraduationCap,
  },
];
export const supportingExperience = [
  [
    "APR 2025 — APR 2026",
    "Member",
    "Career Advancement Committee · School of CSET",
  ],
  [
    "MAR 2025 — JUL 2025",
    "Core Team",
    "Centre for Law, Technology and Innovation · LexHack",
  ],
  [
    "AUG 2024",
    "Management Core Team",
    "Under 25 Summit · crowd and resource coordination",
  ],
  [
    "APR 2023 — APR 2024",
    "Cultural House Secretary",
    "Delhi Public School Roorkee · 500+ participant events",
  ],
];
export const certifications = [
  {
    title: "Deloitte Australia — Data Analytics Job Simulation",
    tag: "DATA ANALYTICS",
    icon: Braces,
  },
  { title: "Python Fundamentals", tag: "PROGRAMMING", icon: Code2 },
  {
    title: "Introduction to Microprocessors",
    tag: "COMPUTER ARCHITECTURE",
    icon: Cpu,
  },
  {
    title: "Operating Systems and You: Becoming a Power User",
    tag: "OPERATING SYSTEMS",
    icon: Code2,
  },
  {
    title: "The Bits and Bytes of Computer Networking",
    tag: "NETWORKING",
    icon: Workflow,
  },
  {
    title: "Smart India Hackathon Certificate",
    tag: "HACKATHON",
    icon: Sparkles,
  },
  {
    title: "Entrepreneurship Strategy: From Ideation to Exit",
    tag: "PRODUCT & BUSINESS",
    icon: Workflow,
  },
  {
    title: "Climate Change Negotiations and Health",
    tag: "INTERDISCIPLINARY",
    icon: Award,
  },
];

export const resume = "/Ameya_Agarwal_resume.pdf";
export type Project = (typeof projects)[number];

// SIH result updated from Ameya's explicit correction; earlier milestone retained.
// Sports wording is unchanged from the linked résumé.
export const achievements = [
  {
    title: "Smart India Hackathon",
    text: "Our team placed 6th out of 590 teams.",
    kind: "Hackathon",
    mark: "6th",
    previous: "Previously: Top 100 in the university-level round.",
    progression: "Top 100 → 6th / 590 teams",
  },
  {
    title: "Sports",
    text: "District-level Boxing Silver Medalist and Fencing Bronze Medalist.",
    kind: "Discipline beyond the screen",
    mark: "↗",
  },
];
