"use client";

import { motion } from "framer-motion";
import { Mail, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { SOCIAL_LINKS } from "@/data/portfolio";

const LINKS = [
  {
    label: "Email",
    href: `mailto:${SOCIAL_LINKS.email}`,
    icon: Mail,
    display: SOCIAL_LINKS.email,
  },
  {
    label: "GitHub",
    href: SOCIAL_LINKS.github,
    icon: GithubIcon,
    display: "royvivante",
  },
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: LinkedinIcon,
    display: "royvivante",
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="mb-3 inline-block font-mono text-xs uppercase tracking-widest text-accent">
          Contact
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
          Let&apos;s Connect
        </h2>
        <p className="text-base text-muted mb-12 leading-relaxed">
          Interested in working together or just want to chat? I&apos;m always open to discussing
          new opportunities and ideas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.label !== "Email" ? "_blank" : undefined}
              rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 rounded-xl border border-card-border bg-card px-5 py-3.5 text-sm text-muted hover:text-foreground hover:border-card-border-hover transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <link.icon size={18} className="text-muted group-hover:text-accent transition-colors" />
              {link.display}
            </a>
          ))}
        </div>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-light hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]"
        >
          <FileText size={16} />
          Download Resume
        </a>
      </motion.div>
    </section>
  );
}
