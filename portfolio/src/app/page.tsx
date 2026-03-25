import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Focus } from "@/components/focus";
import { TechStack } from "@/components/tech-stack";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { SectionDivider } from "@/components/section-divider";
import { AmbientParticles } from "@/components/ambient-particles";

export default function Home() {
  return (
    <>
      <AmbientParticles />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Hero />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Focus />
        <SectionDivider />
        <TechStack />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
