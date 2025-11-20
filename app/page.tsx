import HomeClient from "@/components/HomeClient";
import { experiences, projects, socialLinks } from "@/content/data";

export default function Home() {
  return (
    <HomeClient
      experiences={experiences}
      projects={projects}
      socialLinks={socialLinks}
    />
  );
}
