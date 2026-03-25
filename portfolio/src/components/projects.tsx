"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./icons";
import { TiltCard } from "./tilt-card";
import { PROJECTS, type Project } from "@/data/portfolio";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(index === 0 && "md:col-span-2 md:row-span-2")}
    >
      <TiltCard className="h-full">
        <article className="group relative h-full rounded-2xl border border-card-border bg-card p-6 sm:p-8 transition-all duration-300 hover:border-card-border-hover">
          {/* Accent line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex flex-col h-full">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{project.tagline}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/[0.06] transition-all duration-200"
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
                    className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/[0.06] transition-all duration-200"
                    aria-label={`${project.title} live demo`}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            {index === 0 && (
              <p className="text-sm text-muted/80 leading-relaxed mb-5">{project.description}</p>
            )}

            <ul className="mb-6 space-y-2 flex-1">
              {project.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted/90">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-auto">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-xs font-mono text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
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
