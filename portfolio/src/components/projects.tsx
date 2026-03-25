"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./icons";
import { PROJECTS } from "@/data/portfolio";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

const reveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <motion.article
      custom={index}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "group relative rounded-2xl border border-card-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 transition-all duration-500",
        "hover:border-card-border-hover hover:shadow-[0_0_40px_rgba(124,58,237,0.06)]",
        index === 0 && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Top accent glow line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="flex flex-col h-full">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
            <p className="text-sm text-muted/80 leading-relaxed">{project.tagline}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted/60 hover:text-foreground hover:bg-accent/[0.06] transition-all duration-200"
                aria-label={`${project.title} on GitHub`}
              >
                <GithubIcon size={18} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted/60 hover:text-foreground hover:bg-accent/[0.06] transition-all duration-200"
                aria-label={`${project.title} live demo`}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        {index === 0 && (
          <p className="text-sm text-muted/70 leading-relaxed mb-5">{project.description}</p>
        )}

        <ul className="mb-6 space-y-2 flex-1">
          {project.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted/80">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-accent/60 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-accent/[0.06] border border-accent/[0.1] px-2.5 py-1 text-xs font-mono text-muted/80"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32 px-6">
      <SectionHeading
        label="Work"
        title="Featured Projects"
        description="Systems I've designed, built, and shipped. From medical research platforms to production e-commerce."
      />
      <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
