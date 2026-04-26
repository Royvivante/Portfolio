export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export interface Project {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    title: "ShebaHub",
    slug: "shebahub",
    tagline: "Medical research platform connecting students, mentors, and projects",
    description:
      "A production platform built for Sheba Medical Center that manages researcher collaboration, project matching, and mentorship flows across three user roles.",
    highlights: [
      "Designed RESTful APIs serving 3 user roles with granular RBAC",
      "Built centralized email service (AWS SES) handling 6 notification flows",
      "Implemented file upload security with type validation and ClamAV scanning",
      "Architected rate limiting, audit logging, and auto-generated OpenAPI docs",
    ],
    stack: ["Python", "Django REST", "PostgreSQL", "JWT", "AWS SES", "Docker", "Nginx"],
    github: "https://github.com/HIT-MEDLAB/shebahub",
    featured: true,
  },
  {
    title: "TOP Cipuyim",
    slug: "top-cipuyim",
    tagline: "Production e-commerce platform with AI content assistant and admin dashboard",
    description:
      "A commercial website for vehicle coatings built with real business logic: Stripe payments, stock reservation, CMS with drag-and-drop page builder, and full admin panel.",
    highlights: [
      "~194 TypeScript files with strict type checking across the entire codebase",
      "Database-driven CMS with drag-and-drop page builder (9 section types)",
      "AI content assistant analyzing pages and suggesting improvements",
      "Stock reservation system preventing overselling with cron-based cleanup",
    ],
    stack: ["TypeScript", "Next.js", "React", "Tailwind", "Supabase", "Stripe", "Vercel"],
    github: "https://github.com/Royvivante/top-cipuyim",
    live: "https://top-tzipuim.vercel.app",
    featured: true,
  },
  {
    title: "Bitcoin Sentiment Analysis",
    slug: "btc-sentiment",
    tagline: "NLP research exploring predictive signals in crypto-related text",
    description:
      "A data science investigation into whether tweet sentiment can predict Bitcoin price direction, comparing classical NLP baselines against deep learning approaches.",
    highlights: [
      "Processed ~66,000 Bitcoin-related tweets with temporal data splitting",
      "TF-IDF + Logistic Regression baseline achieved ROC-AUC 0.5599",
      "Built Bidirectional LSTM pipeline with TensorFlow/Keras",
      "Statistical validation with Welch t-test and Bootstrap confidence intervals",
    ],
    stack: ["Python", "TensorFlow", "scikit-learn", "Pandas", "NLP", "LSTM"],
    github: "https://github.com/MorSigman/btc_language_signals_project",
  },
  {
    title: "WinProb",
    slug: "winprob",
    tagline: "NBA win-probability prediction platform with ML scoring and audit trail",
    description:
      "An MVP sports prediction system that combines game data ingestion, feature engineering, logistic regression scoring, and grounded explanations with full prediction history.",
    highlights: [
      "Six-feature logistic regression model with baseline comparisons and Brier score evaluation",
      "Append-only prediction history with structured diffing for full auditability",
      "Async FastAPI backend with SQLAlchemy 2.x and PostgreSQL via Alembic migrations",
      "Analyst dashboard and mobile-first consumer app for exploring predictions",
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "scikit-learn", "SQLAlchemy", "React", "Docker"],
    github: "https://github.com/Royvivante/Sports",
  },
];

export interface FocusArea {
  title: string;
  description: string;
  icon: string;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    title: "Clean Backend Architecture",
    description:
      "Designing RESTful APIs with clear separation of concerns, structured error handling, and maintainable service layers.",
    icon: "server",
  },
  {
    title: "Clean Architecture & OOP",
    description:
      "Designing systems with strong separation of concerns, reusable logic, maintainable structure, and disciplined engineering practices.",
    icon: "blocks",
  },
  {
    title: "Secure Auth & Permissions",
    description:
      "Implementing JWT-based authentication, role-based access control, and row-level security from day one.",
    icon: "shield",
  },
  {
    title: "Production-Oriented Development",
    description:
      "Building systems that are deployed, monitored, and used by real people, not just demos or side projects.",
    icon: "rocket",
  },
  {
    title: "Fast, Responsive Interfaces",
    description:
      "Creating polished frontend experiences with SSR, optimistic updates, and thoughtful interaction design.",
    icon: "monitor",
  },
  {
    title: "Real-World Problem Solving",
    description:
      "Translating business requirements into technical solutions, from stock reservation logic to email notification flows.",
    icon: "lightbulb",
  },
];

export interface TechGroup {
  category: string;
  items: string[];
}

export const TECH_STACK: TechGroup[] = [
  {
    category: "Backend",
    items: ["Python", "Django", "Django REST Framework", "C#", ".NET", "Node.js", "REST APIs", "JWT / RBAC"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "SQL", "Supabase", "Row-Level Security"],
  },
  {
    category: "DevOps",
    items: ["Git", "GitHub", "Vercel", "Docker", "Nginx", "AWS SES"],
  },
  {
    category: "Engineering Foundations",
    items: ["Object-Oriented Design", "Clean Code", "Separation of Concerns", "SOLID Principles"],
  },
  {
    category: "Data & AI",
    items: ["Pandas", "scikit-learn", "TensorFlow", "NLP", "LSTM", "Statistical Testing"],
  },
];

export const SOCIAL_LINKS = {
  email: "roy.vivantee@gmail.com",
  github: "https://github.com/royvivante",
  linkedin: "https://linkedin.com/in/royvivante",
  phone: "+972-54-521-1663",
} as const;
