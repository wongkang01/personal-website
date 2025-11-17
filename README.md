# Wong Kang Portfolio (Next.js edition)

A GSAP-enhanced, data-driven portfolio built with Next.js 16 App Router, Tailwind CSS, and motion-focused storytelling. The site replaces the legacy static HTML build with a modern stack that supports dedicated case-study routes for every project.

## Highlights

- **Persistent sidebar layout** with smooth scrolling, smart section highlighting, and a glassy UI treatment.
- **GSAP + ScrollTrigger interactions** for section reveals, card motion, and a cursor spotlight that responds to pointer movement (with reduced-motion fallbacks).
- **Data-driven content model** (`content/data.ts`) powering both the homepage and `/projects/[slug]` case-study routes.
- **Modern UI primitives** using Tailwind 4 utility classes, filterable project grids, and a `next-themes` powered dark/light toggle.

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 + custom utility classes |
| Motion | GSAP, ScrollTrigger, custom cursor spotlight |
| State & Theming | React Server/Client Components, `next-themes`, `clsx` |
| Content | Structured TypeScript data in `content/data.ts` |

## Project Structure

```text
app/
├── layout.tsx            # Metadata + theme provider wrapper
├── page.tsx              # Entry page rendering <PortfolioPage />
└── projects/[slug]/      # Dynamic case-study routes
components/
├── portfolio-page.tsx    # Client shell w/ GSAP + filters
├── nav-sidebar.tsx       # Sticky navigation + socials
├── about/experience/projects sections
└── theme-provider.tsx    # next-themes wrapper
content/data.ts           # About copy, experience + project data
public/images             # Thumbnails, profile photo
public/files              # Downloadable collateral (resume, etc.)
docs/                     # Resume LaTeX + planning docs
legacy-site/              # Archived static HTML/CSS version
```

## Getting Started

```pwsh
npm install
npm run dev
```

- Open <http://localhost:3000> to view the portfolio.
- `npm run lint` executes ESLint (Core Web Vitals rules) and `npm run build` produces the production bundle used by Vercel/GitHub Actions deployments.

## Animations & Accessibility

- GSAP ScrollTrigger powers section/card reveals and respects `prefers-reduced-motion` to avoid unwanted motion.
- A cursor spotlight layer enhances depth while keeping pointer events disabled.
- Theme toggle relies on `next-themes`, persisting the preference and hydrating without layout shift.

## Editing Content

- Update biography, experience, and projects in `content/data.ts`. Each project contains metadata for both the homepage card and its `/projects/[slug]` detail page (problem, approach, impact, links, hero image, etc.).
- Images live in `public/images`. Keep aspect ratios around 16:9 for hero banners to retain consistent layout.
- The archived static site remains available in `legacy-site/` for reference but is excluded from builds/linting.

## Deployment

- Deploy to Vercel (recommended) or any Node-capable platform. Preview deployments inherit the App Router static generation setup, and project routes are pre-rendered via `generateStaticParams`.

## Further Enhancements

- Expand project narratives with MDX or Contentlayer if editorial workflows grow.
- Layer in analytics (Vercel Analytics/Plausible) and a contact form service (Resend/Formspree) as needed.
- Reference `docs/nextjs-modernization-plan.md` for the extended roadmap and sprint breakdown per feature area.

Maintained by Wong Kang · PRs and suggestions welcome.
