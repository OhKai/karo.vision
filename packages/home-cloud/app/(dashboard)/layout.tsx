import Image from "next/image";
import HeaderNav from "./header-nav";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import MiniAudioPlayer from "./mini-audio-player";
import AudioPlayerProvider from "./audio-player-provider";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AudioPlayerProvider>
      <div className="flex min-h-screen flex-col justify-items-center pb-20">
        <header className="text-muted-foreground border-secondary bg-background/97 fixed z-50 grid h-[70px] w-full grid-cols-3 items-center justify-items-center border-b px-2 backdrop-blur-sm md:px-6">
          <div className="hidden items-center gap-2 justify-self-start select-none md:flex">
            <Image
              src="/logo.png"
              alt="Karo.Vision Home Cloud"
              width={48}
              height={31}
              className="invert-[.145]"
            />
            <h2 className="flex flex-col text-base leading-none font-bold tracking-[0.25px]">
              <span className="text-xs">karo.vision</span>
              <span>Home&nbsp;Cloud</span>
            </h2>
          </div>
          <HeaderNav className="col-start-2" />
          <MiniAudioPlayer />
          <Button
            className="size-10 justify-self-end"
            size="icon"
            variant="ghost"
            title="Settings"
          >
            <Settings className="size-6" />
          </Button>
        </header>
        <main className="mt-[70px] w-full">{children}</main>
      </div>
    </AudioPlayerProvider>
  );
};

export default DashboardLayout;
