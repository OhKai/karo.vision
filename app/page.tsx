import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeaderNav from "@/components/header-nav";
import SearchBar from "@/components/search-bar";

const Home = () => {
  return (
    <div className="grid grid-rows-[70px_1fr] justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <header className="grid grid-cols-3 items-center justify-items-center w-full px-6 text-muted-foreground border-b border-secondary">
        <div className="flex items-center gap-2 justify-self-start select-none">
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
        <HeaderNav />
        <Button
          className="justify-self-end"
          size="icon"
          variant="ghost"
          title="Settings"
        >
          <Settings />
        </Button>
      </header>
      <main className="flex flex-col gap-8 items-center py-4">
        <SearchBar />
      </main>
    </div>
  );
};

export default Home;
