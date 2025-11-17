import { PortfolioPage } from "@/components/portfolio-page";
import { experiences, projects, socialLinks } from "@/content/data";

export default function Home() {
  return (
    <PortfolioPage
      experiences={experiences}
      projects={projects}
      socialLinks={socialLinks}
    />
  );
}
