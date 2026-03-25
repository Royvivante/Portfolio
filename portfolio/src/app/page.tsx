import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Focus } from "@/components/focus";
import { TechStack } from "@/components/tech-stack";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Focus />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
