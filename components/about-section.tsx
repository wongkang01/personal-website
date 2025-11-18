import Image from "next/image";
import { aboutCopy } from "@/content/data";

export function AboutSection() {
  return (
    <section
      id="about"
      data-section="about"
      className="section-shell min-h-screen items-center gap-10 py-16"
    >
      <div data-about-copy className="space-y-6 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.4em] text-teal-300">About</p>
        <h2 className="text-4xl font-semibold text-white">{aboutCopy.headline}</h2>
        <p className="text-lg text-zinc-300">{aboutCopy.subhead}</p>
        <p className="text-base leading-relaxed text-zinc-400">{aboutCopy.bio}</p>
        <ul className="flex flex-wrap gap-3">
          {aboutCopy.focusAreas.map((item) => (
            <li
              key={item}
              className="rounded-full border border-teal-300/30 px-4 py-2 text-xs uppercase tracking-wide text-teal-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full justify-center">
        <div
          data-about-photo
          className="relative h-64 w-64 overflow-hidden rounded-3xl border border-white/10 lg:h-80 lg:w-80"
        >
          <Image
            src="/images/profile_img.jpg"
            alt="Portrait of Wong Kang"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 320px, 400px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40" />
        </div>
      </div>
    </section>
  );
}
