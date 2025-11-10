import { Github, Linkedin, Twitter } from "lucide-react";
import { ThemeProvider } from "next-themes";
import ProjectCard from "./project-card";

export default function Home() {
  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <main className="font-sans flex min-h-dvh items-center justify-center flex-col md:p-24 p-12">
        <div className="flex scale-[0.875] items-center gap-3.5 text-3xl md:scale-100 dark:drop-shadow-[0_0_0.3rem_#ffffff70]">
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="dark:invert text-[#363636] w-[65.625px] h-[65.625px]"
          >
            <path d="M47.974 0V21.7482L21.7482 47.974H0L47.974 0Z" />
            <path d="M100 47.974L78.2518 47.974L52.026 21.7482L52.026 0L100 47.974Z" />
            <path d="M0 52.026H21.7482L47.974 78.2518V100L0 52.026Z" />
            <path d="M52.026 100L52.026 78.2518L78.2518 52.026L100 52.026L52.026 100Z" />
          </svg>
          <div className="font-semibold">KARO.VISION</div>
        </div>
        <div className="w-px h-10 dark:bg-[#2e2e2e] bg-[#d5d5d5] my-6"></div>
        <div className="font-extralight md:text-xl text-lg">
          <span className="font-semibold mr-4">Kai Rohwer</span>{" "}
          Software&nbsp;Engineer
        </div>
        <div className="w-px h-10 dark:bg-[#2e2e2e] bg-[#d5d5d5] my-6"></div>
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/kai-rohwer-167406199/"
            target="_blank"
          >
            <Linkedin className="size-6" />
          </a>
          <a href="https://github.com/OhKai" target="_blank">
            <Github className="size-6" />
          </a>
          <a href="https://www.twitter.com/karo_vision_" target="_blank">
            <Twitter className="size-6" />
          </a>
        </div>
        <div className="w-px h-10 dark:bg-[#2e2e2e] bg-[#d5d5d5] my-6"></div>
        <div className="text-lg font-mono font-bold">Personal Projects</div>
        <div className="mt-4 flex flex-col items-center gap-6">
          <ProjectCard
            href="/home-cloud"
            title="Home Cloud"
            type="Electron App"
            description="A personal cloud storage solution for seamless file access and sharing."
            image="screenshot-photos"
            linkType="Website"
          />
          <ProjectCard
            href="https://apai.tech/"
            title="APAI"
            type="Web App"
            description="AI tools directory & design experiments."
            image="apai"
            linkType="Website"
          />
          <ProjectCard
            href="https://apps.apple.com/de/app/sketch-ball-draw-the-line/id1639201509"
            title="Sketch Ball"
            type="Swift App"
            description="Casual line-drawing game with procedural gameplay."
            image="sketch-ball"
            linkType="App Store"
          />
          <ProjectCard
            title="Apfel-Live.de"
            type="Web App"
            description="Liveticker website for Apple Keynote events ~2014. My first major production project with peak traffic of over 30,000 concurrent users."
            image="apfel-live"
          />
        </div>
      </main>
    </ThemeProvider>
  );
}
