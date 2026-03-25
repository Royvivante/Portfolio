"use client";

import { motion } from "framer-motion";
import { ContactForm } from "./contact-form";
import StackedArticleCards from "./ui/stacked-article-cards";
import { SOCIAL_LINKS } from "@/data/portfolio";

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
    url: "/Roy_Vivante_CV_final.pdf",
    title: "Resume",
    subTitle: "Download my latest CV",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=200&fit=crop&q=80",
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-5xl"
      >
        <div className="text-center mb-14">
          <span className="mb-3 inline-block font-mono text-xs uppercase tracking-widest text-accent/70">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-base text-muted/80 leading-relaxed">
            Interested in working together or just want to chat? Send me a message
            or find me on the links below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-sm font-medium text-foreground/60 mb-4 font-mono uppercase tracking-wider">
              Send a message
            </h3>
            <ContactForm />
          </div>

          <div className="hidden md:block">
            <h3 className="text-sm font-medium text-foreground/60 mb-4 font-mono uppercase tracking-wider">
              Find me
            </h3>
            <StackedArticleCards items={STACKED_ITEMS} />
          </div>
        </div>

        <div className="mt-12 md:hidden flex justify-center">
          <StackedArticleCards items={STACKED_ITEMS} />
        </div>
      </motion.div>
    </section>
  );
}
