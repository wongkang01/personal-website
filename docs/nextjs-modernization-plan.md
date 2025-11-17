# Next.js Modernization Program – Task Breakdown

A detailed execution plan to rebuild Wong Kang's static portfolio into a modern Next.js experience that uses GSAP-driven motion, contemporary UI frameworks, and per-project case-study pages. Tasks are grouped into five delivery phases plus an ongoing backlog so work can be scheduled across sprints.

---

## 0. Guiding Principles

- **Experience parity first, enhancement second.** Replicate all existing content before shipping new features.
- **Animation with intent.** GSAP timelines should reinforce storytelling without harming performance or accessibility.
- **Composable data.** Experience/projects live in a structured source (Contentlayer/JSON/MDX) to power multiple routes.
- **Each project, its own narrative.** Dedicated `/projects/[slug]` pages will later host GSAP-enhanced deep dives.

---

## 1. Phase Breakdown

| Phase | Sprint Focus | Exit Criteria |
| --- | --- | --- |
| 1. Foundations | Scaffold repo, UI system, shared layout | Next.js 15 + TypeScript app boots with sidebar layout + theming + linting |
| 2. Content & Components | Structured data and reusable UI | Home page renders About/Experience/Projects from data sources |
| 3. Motion System | GSAP timelines + transitions | Scroll reveals, cursor spotlight, route transitions integrated with reduced-motion fallbacks |
| 4. UX Polish | Visual refinements + interactivity | Filters, theme toggle, loading states, responsive QA complete |
| 5. Delivery | Platform services + deployment | Optimized assets, metadata, analytics, Vercel pipeline live |

---

## 2. Detailed Tasks

### Phase 1 – Project Setup & Foundations

| Task | Description | Owner | Dependencies | Est. Effort |
| --- | --- | --- | --- | --- |
| 1.1 Repo bootstrap | Create Next.js 15 App Router project with TypeScript, ESLint, Prettier, Husky hooks | Dev | None | 0.5 day |
| 1.2 UI toolkit | Install Tailwind CSS + shadcn/ui (or Chakra UI) and configure design tokens for dark theme | Dev | 1.1 | 0.5 day |
| 1.3 Layout shell | Build persistent sidebar layout with responsive grid, placeholder sections, SEO metadata in `app/layout.tsx` | Dev | 1.2 | 1 day |
| 1.4 Content contract | Define TypeScript types for `Experience`, `Project`, `Tag`, etc. | Dev | 1.1 | 0.5 day |

### Phase 2 – Content Modeling & Components

| Task | Description | Owner | Dependencies | Est. Effort |
| --- | --- | --- | --- | --- |
| 2.1 Data source setup | Choose Contentlayer or local JSON for experience/projects; add slugs, media, SEO fields | Dev | 1.4 | 1 day |
| 2.2 Core components | Build `<NavSidebar>`, `<Section>`, `<Card>`, `<TagList>`, `<ProjectGrid>` with props validated by the new types | Dev | 2.1 | 1.5 days |
| 2.3 Home assembly | Compose About, Experience, Project sections pulling from data source; ensure responsive behavior | Dev | 2.2 | 1 day |
| 2.4 Project routes scaffold | Add dynamic route `/projects/[slug]` rendering placeholder detail view per project | Dev | 2.1 | 0.5 day |

### Phase 3 – Motion & Interaction System

| Task | Description | Owner | Dependencies | Est. Effort |
| --- | --- | --- | --- | --- |
| 3.1 GSAP integration | Install GSAP + `@gsap/react`; create hooks for timelines and ScrollTrigger usage in client components | Dev | 2.x | 1 day |
| 3.2 Section reveals | Apply GSAP scroll animations to sections/cards with reduced-motion guards | Dev | 3.1 | 1 day |
| 3.3 Cursor + parallax | Recreate/extend the cursor spotlight and add parallax background layers using GSAP timelines | Dev | 3.1 | 1 day |
| 3.4 Route transitions | Implement page transition timeline between home and `/projects/[slug]` using GSAP or Framer Motion | Dev | 2.4 | 1 day |

### Phase 4 – Visual Polish & UX Enhancements

| Task | Description | Owner | Dependencies | Est. Effort |
| --- | --- | --- | --- | --- |
| 4.1 Glassmorphic accents | Add cards/sections with glassmorphism tokens, refine typography scale | Dev/Design | 2.2 | 0.5 day |
| 4.2 Theme toggle | Integrate `next-themes` for dark/light switch with persisted preference | Dev | 1.2 | 0.5 day |
| 4.3 Project filters | Build tag-based filter/search for projects on home page | Dev | 2.3 | 1 day |
| 4.4 Loading & skeletons | Add suspense fallbacks, route-level skeletons, and global progress indicator | Dev | 3.4 | 0.5 day |
| 4.5 A11y & QA | Keyboard nav, focus states, screen reader labels, responsive sweep across breakpoints | QA | All prior | 1 day |

### Phase 5 – Platform Integrations & Delivery

| Task | Description | Owner | Dependencies | Est. Effort |
| --- | --- | --- | --- | --- |
| 5.1 Media optimization | Use `next/image`, convert large assets to AVIF/WebP, configure remote patterns | Dev | 2.1 | 0.5 day |
| 5.2 Metadata automation | Generate Open Graph/Twitter cards per route via Next.js dynamic metadata APIs | Dev | 2.4 | 0.5 day |
| 5.3 Analytics + contact | Wire Vercel Analytics or Plausible and add contact form (Resend/API route/Formspree) | Dev | 1.x | 1 day |
| 5.4 CI/CD & hosting | Configure Vercel project, preview deployments, branch protections, monitoring alerts | DevOps | 5.1 | 0.5 day |

---

## 3. Dedicated Project Pages (Future Sprints)

Each featured project receives its own page after Phase 2 foundations.

1. **Content outline** per project (problem, approach, stack, outcomes, learnings).
2. **GSAP storytelling** timeline per page (hero reveal, step-by-step choreographies).
3. **Asset prep** (screenshots, videos, diagrams) optimized for responsive display.
4. **Case-study components** (timeline, challenge/solution blocks, testimonial quotes).
5. **Feedback loop** with stakeholders before publishing each page.

Treat each page as an independent sprint with design review, build, QA, and publish steps.

---

## 4. Cross-Cutting Concerns & Backlog

- **Performance budgets:** Lighthouse >= 90, Interaction to Next Paint < 200ms on modern hardware.
- **Localization-ready copy:** Keep strings centralized for future i18n.
- **Content editing workflow:** Evaluate Sanity/Notion API if non-technical edits become frequent.
- **Testing:** Add Playwright smoke tests for navigation and animations (with prefers-reduced-motion set).
- **Monitoring:** Hook Vercel cron or GitHub Actions for link checking and dependency updates.

---

## 5. Suggested Timeline

| Week | Deliverables |
| --- | --- |
| Week 1 | Phase 1 completed, repo scaffolded, layout live |
| Week 2 | Phase 2 components + data + dynamic routes |
| Week 3 | Phase 3 GSAP interactions + transitions |
| Week 4 | Phase 4 polish, QA, theme toggle, filters |
| Week 5 | Phase 5 integrations, Vercel launch, retro |
| Week 6+ | Individual project case-study pages, experimentation |

Timeline assumes one primary contributor; adjust for team size or parallelization.

---

## 6. Acceptance Criteria Checklist

- [ ] Home page parity with current content, responsive across desktop/tablet/mobile.
- [ ] Navigation + GSAP animations respect `prefers-reduced-motion` and remain performant.
- [ ] Each project appears on `/projects/[slug]` with hero, details, tags, and call-to-action.
- [ ] Core Web Vitals meet targets in Vercel dashboard.
- [ ] Deployment pipeline with preview URLs, analytics, and monitoring in place.

---

**Last updated:** November 17, 2025
