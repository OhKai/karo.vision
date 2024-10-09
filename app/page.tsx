import { Settings, TvMinimalPlay, Image as LImage, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="grid grid-rows-[70px_1fr] justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <header className="grid grid-cols-3 items-center justify-items-center w-full px-6 text-muted-foreground border-b border-secondary">
        <div className="flex items-center gap-2 justify-self-start">
          <Image
            src="/logo.png"
            alt="Karo.Vision Home Cloud"
            width={48}
            height={31}
            className="invert-[.145]"
          />
          <h2 className="text-base font-bold flex flex-col leading-none">
            <span className="text-xs">karo.vision</span>
            <span>Home&nbsp;Cloud</span>
          </h2>
        </div>
        <nav className="flex gap-3">
          <Button
            asChild
            size="icon"
            variant="ghost"
            data-active="true"
            className="relative data-[active]:text-secondary-foreground after:block after:w-1 after:h-1 after:absolute after:-bottom-1.5 after:rounded-full after:bg-secondary-foreground"
          >
            <Link href="/">
              <TvMinimalPlay />
            </Link>
          </Button>
          <Button asChild size="icon" variant="ghost">
            <Link href="/photos">
              <LImage />
            </Link>
          </Button>
          <Button asChild size="icon" variant="ghost">
            <Link href="/music">
              <Music />
            </Link>
          </Button>
        </nav>
        <Button className="justify-self-end" size="icon" variant="ghost">
          <Settings />
        </Button>
      </header>
      <main className="flex flex-col gap-8 items-center sm:items-start"></main>
    </div>
  );
};

export default Home;
