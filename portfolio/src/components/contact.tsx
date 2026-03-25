"use client";

import { motion } from "framer-motion";
import { Mail, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import StackedArticleCards from "./ui/stacked-article-cards";
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

const STACKED_ITEMS = [
  {
    url: SOCIAL_LINKS.github,
    title: "GitHub",
    subTitle: "Explore my open source projects and code",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80",
  },
  {
    url: SOCIAL_LINKS.linkedin,
    title: "LinkedIn",
    subTitle: "Let's connect professionally",
    img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&h=200&fit=crop&q=80",
  },
  {
    url: `mailto:${SOCIAL_LINKS.email}`,
    title: "Email",
    subTitle: SOCIAL_LINKS.email,
    img: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop&q=80",
  },
  {
    url: "/resume.pdf",
    title: "Resume",
    subTitle: "Download my latest CV",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=200&fit=crop&q=80",
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
        className="mx-auto max-w-4xl"
      >
        <div className="text-center mb-14">
          <span className="mb-3 inline-block font-mono text-xs uppercase tracking-widest text-accent">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-base text-muted leading-relaxed">
            Interested in working together or just want to chat? I&apos;m always open to discussing
            new opportunities and ideas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — classic links */}
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 rounded-xl border border-card-border bg-card px-5 py-3.5 text-sm text-muted hover:text-foreground hover:border-card-border-hover transition-all duration-200"
              >
                <link.icon
                  size={18}
                  className="text-muted group-hover:text-accent transition-colors"
                />
                {link.display}
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-light hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]"
            >
              <FileText size={16} />
              Download Resume
            </a>
          </div>

          {/* Right — stacked interactive cards */}
          <div className="hidden md:block">
            <StackedArticleCards items={STACKED_ITEMS} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
