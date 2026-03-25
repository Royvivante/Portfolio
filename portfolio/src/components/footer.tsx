import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { SOCIAL_LINKS } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="relative border-t border-accent/[0.06] py-10 px-6">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted/40">
          &copy; {new Date().getFullYear()} Roy Vivante
        </p>

        <div className="flex items-center gap-5">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted/40 hover:text-accent/70 transition-colors duration-300"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted/40 hover:text-accent/70 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-muted/40 hover:text-accent/70 transition-colors duration-300"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>

        <p className="text-xs text-muted/30">
          Crafted with code and attention to detail
        </p>
      </div>
    </footer>
  );
}
