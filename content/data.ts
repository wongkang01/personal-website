export type SocialLink = {
  platform: "github" | "linkedin" | "email";
  label: string;
  href: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  timeframe: string;
  summary: string;
  highlights: string[];
  tags: string[];
  logo?: {
    src: string;
    alt: string;
  };
};

export type ProjectLink = {
  label: string;
  href: string;
  type: "external" | "github" | "case-study";
};

export type Project = {
  slug: string;
  name: string;
  timeframe: string;
  tagline: string;
  description: string;
  heroImage: string;
  tags: string[];
  links: ProjectLink[];
  highlights: string[];
  problem: string;
  approach: string;
  impact: string;
  focus: string;
};

export const socialLinks: SocialLink[] = [
  {
    platform: "github",
    label: "GitHub",
    href: "https://github.com/wongkang01",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/kang-wong-b8a05a226",
  },
  {
    platform: "email",
    label: "Email",
    href: "mailto:wongkangmain@gmail.com",
  },
];

export const aboutCopy = {
  headline: "Wong Kang",
  subhead: "Computer Science @ SUTD · Builder of AI-forward products",
  bio:
    "Second-year computer science student with a focus on fintech, AI, and product engineering. I enjoy architecting systems that tame messy data, layering delightful interactions on top, and shipping resilient software that users actually love.",
  focusAreas: [
    "Applied AI for operational efficiency",
    "Full-stack product delivery with Next.js",
    "Human-centered design with motion and storytelling",
  ],
};

export const experiences: Experience[] = [
  {
    id: "aisg-ai-engineer",
    role: "AI Engineer Intern",
    company: "AI Singapore",
    timeframe: "Aug 2025 – Jan 2026",
    summary:
      "Designed multi-agent research assistants that orchestrate supervised research workflows and compress hours of manual analysis into minutes.",
    highlights: [
      "Built a LangGraph supervisor that decomposes briefs, assigns ephemeral researcher agents, and enforces quality gates before synthesis.",
      "Integrated ChromaDB + Gemini embeddings for semantic retrieval so agents could cite trusted sources and avoid redundant searches.",
      "Cut research turnaround time by automating web search, citation validation, and iterative report refinement.",
    ],
    tags: [
      "LangGraph",
      "LangChain",
      "Agents",
      "ChromaDB",
      "Gemini",
      "Python",
    ],
    logo: {
      src: "/images/aisg.png",
      alt: "AI Singapore logo",
    },
  },
  {
    id: "ncs-it-ops",
    role: "Information Technology Operations Project Intern",
    company: "NCS Group",
    timeframe: "Jun 2023 – Sep 2023",
    summary:
      "Built an automated pipeline to retrieve, normalize, and track enterprise hardware end-of-life data, saving the ops team hours of manual effort each week.",
    highlights: [
      "Scraped OEM advisories with OpenAI function calling, BeautifulSoup, and Requests, then organized data with Pandas.",
      "Prototyped a Streamlit interface for the ops team and deployed it to Amazon EC2 for secure team-wide access.",
      "Cut the manual lookup process from days to minutes while improving coverage of upcoming EOL events.",
    ],
    tags: [
      "Python",
      "OpenAI API",
      "BeautifulSoup",
      "Pandas",
      "Streamlit",
      "AWS EC2",
    ],
    logo: {
      src: "/images/NCS-logo.png",
      alt: "NCS Group logo",
    },
  },
];

export const projects: Project[] = [
  {
    slug: "modsutd",
    name: "MODSUTD",
    timeframe: "May 2025 – Present",
    tagline: "University module planning on a resilient, typed Next.js stack.",
    description:
      "Designing the backend for a collaborative module planner with Drizzle ORM, PostgreSQL on Supabase, and Clerk authentication. Focused on normalized data design and reliable data services for intensive scheduling workflows.",
    heroImage: "/images/modsutd.jpg",
    tags: ["Next.js", "tRPC", "Drizzle ORM", "PostgreSQL", "Supabase", "Clerk"],
    links: [
      {
        label: "Live site",
        href: "https://mo-dutd-d796.vercel.app/",
        type: "external",
      },
    ],
    highlights: [
      "Owns the API contract powering complex filtering and planning flows",
      "Implements background jobs for schedule validation and reminders",
      "Collaborates with design partners on IA and data visualizations",
    ],
    problem:
      "Students lacked a reliable way to compare module paths, prerequisites, and workload trade-offs in a single view.",
    approach:
      "Designed a relational schema with Drizzle ORM, exposed it through typed routers, and orchestrated Supabase Postgres with Clerk authentication to keep the experience real-time and secure.",
    impact:
      "Early pilot testers reduced planning time by 40% and surfaced prerequisite issues before course bidding opened.",
    focus: "Full Stack Web Dev",
  },
  {
    slug: "optistaff",
    name: "OptiStaff",
    timeframe: "May 2025 – Present",
    tagline: "Intelligent staffing and scheduling with automation at its core.",
    description:
      "Full-stack build of an intelligent staffing platform that helps operations teams assign flexible workers faster. Pairing a React/Next.js frontend with a Node.js API and PostgreSQL managed via Prisma ORM.",
    heroImage: "/images/optistaff.png",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Automation"],
    links: [
      {
        label: "Product brief",
        href: "https://optistaff-portfolio.vercel.app/#tech-stack",
        type: "external",
      },
    ],
    highlights: [
      "Owns user + client workflows with real-time updates",
      "Models complex staffing rules inside PostgreSQL",
      "Designs automation scripts for availability reconciliation",
    ],
    problem:
      "Operations managers were stuck reconciling spreadsheets and chats to fill shifts, resulting in unstaffed work and burned-out teams.",
    approach:
      "Modeled constraints in PostgreSQL, layered Prisma data services, and built scheduling UI flows that surface conflicts before publishing.",
    impact:
      "Cut manual reconciliation time per shift from 45 minutes to under 10 in pilot tests.",
    focus: "Full Stack Web Dev",
  },
  {
    slug: "adminless",
    name: "AdminLess.ai",
    timeframe: "Mar 2025 – Present",
    tagline: "AI receptionist that turns clinic phone chaos into calm.",
    description:
      "Front-end lead for an AI receptionist that triages calls, books appointments, and answers FAQs for clinics using Next.js, TypeScript, and Tailwind.",
    heroImage: "/images/adminless.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind", "AI"],
    links: [
      {
        label: "Live site",
        href: "https://www.adminless.ai/",
        type: "external",
      },
    ],
    highlights: [
      "Built responsive landing + demo flow with accessibility baked in",
      "Collaborated with founders on brand system and motion cues",
      "Implemented CMS-driven sections for rapid iteration",
    ],
    problem:
      "Clinic teams juggle appointment calls, insurance questions, and follow-ups without a scalable assistant.",
    approach:
      "Designed a conversational marketing site with story-driven sections and integrated demo booking components.",
    impact:
      "Beta clinics cut phone queue backlog by 60% while improving CSAT.",
    focus: "AI & Entrepreneurship",
  },
  {
    slug: "wandr",
    name: "Wandr",
    timeframe: "Feb 2025 – Apr 2025",
    tagline: "Social travel planning that won Singtel's InfoSys Programming Awards.",
    description:
      "Android app merging travel itineraries with social discovery. Led UI/UX in Figma, built custom XML layouts, Java backend, and MySQL + Firebase data layer.",
    heroImage: "/images/wandr.png",
    tags: ["Android", "Java", "MySQL", "Firebase", "Figma"],
    links: [
      {
        label: "Product site",
        href: "https://linkthreelala.my.canva.site/wandr",
        type: "external",
      },
    ],
    highlights: [
      "Crafted custom Android UI components for itinerary cards",
      "Implemented social graph and trip collaboration",
      "Won 1st Prize at Singtel Information Systems & Programming Awards 2025",
    ],
    problem:
      "Travelers planned in isolation and couldn’t merge recs or photos easily.",
    approach:
      "Married social feed mechanics with travel itineraries and built synchronization flows via Firebase.",
    impact:
      "User study participants reported 2× faster trip planning and higher engagement.",
    focus: "Android App Development",
  },
  {
    slug: "crop-yield",
    name: "Crop Yield Prediction",
    timeframe: "Nov 2024",
    tagline: "Machine learning models that support sustainable food policies.",
    description:
      "Multiple linear regression model using gradient descent to predict crop yield. Cleaned and standardized multi-source datasets using Pandas and visualized insights with Matplotlib.",
    heroImage: "/images/crop_yield_prediction.jpg",
    tags: ["Python", "Pandas", "Matplotlib", "Machine Learning"],
    links: [
      {
        label: "Live viz",
        href: "https://wongkang01.github.io/crop_yield_prediction/",
        type: "external",
      },
      {
        label: "GitHub",
        href: "https://github.com/wongkang01/crop_yield_prediction",
        type: "github",
      },
    ],
    highlights: [
      "Engineered features to normalize weather + soil data",
      "Visualized policy-ready insights in Matplotlib dashboards",
      "Documented methodology for decision-makers",
    ],
    problem:
      "Policy teams lacked a consistent, data-driven signal for upcoming crop yields.",
    approach:
      "Ingested multi-source data, standardized it, and trained regression models with gradient descent.",
    impact:
      "Model achieved sub-5% MAPE on validation data, informing planning conversations.",
    focus: "Machine Learning",
  },
];
