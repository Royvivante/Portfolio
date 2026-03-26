import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Focus } from "@/components/focus";
import { TechStack } from "@/components/tech-stack";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { SectionDivider } from "@/components/section-divider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SectionDivider />
        <Projects />
        <Focus />
        <SectionDivider />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
