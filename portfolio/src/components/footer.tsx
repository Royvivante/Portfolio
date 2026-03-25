import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { SOCIAL_LINKS } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted/60">
          &copy; {new Date().getFullYear()} Roy Vivante
        </p>

        <div className="flex items-center gap-4">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted/50 hover:text-muted transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted/50 hover:text-muted transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-muted/50 hover:text-muted transition-colors"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>

        <p className="text-xs text-muted/40">
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
