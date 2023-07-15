import { Github, Mail, Twitter } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-full items-center justify-center flex-col md:p-24 p-2">
      <div className="flex scale-[0.875] items-center gap-2 text-3xl md:scale-100 dark:drop-shadow-[0_0_0.3rem_#ffffff70]">
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
      <div className="w-[1px] h-10 bg-[#2e2e2e] my-6"></div>
      <div className="font-extralight md:text-xl text-lg">
        <span className="font-semibold mr-4">Kai Rohwer</span>{" "}
        Software&nbsp;Engineer
      </div>
      <div className="w-[1px] h-10 bg-[#2e2e2e] my-6"></div>
      <div className="flex items-center gap-5">
        <a href="https://www.twitter.com/karo_vision_" target="_blank">
          <Twitter className="w-6 h-6" />
        </a>
        <a href="mailto:info@apai.tech">
          <Mail className="w-6 h-6" />
        </a>
        <a href="https://github.com/OhKai" target="_blank">
          <Github className="w-6 h-6" />
        </a>
      </div>
      <div className="w-[1px] h-10 bg-[#2e2e2e] my-6"></div>
      <div className="text-lg font-mono font-bold">
        <a href="https://www.apai.tech/apps">apai.tech</a>
      </div>
    </main>
  );
}
