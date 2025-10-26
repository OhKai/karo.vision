import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import Image from "next/image";

const Welcome = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-44">
      <div className="text-muted-foreground animate-in fade-in slide-in-from-bottom flex items-center gap-5 duration-[2.5s] select-none">
        <Image
          src="/logo.png"
          alt="Karo.Vision Home Cloud"
          width={135}
          height={87}
          className="invert-[.145]"
        />
        <h2 className="flex flex-col text-[48px] leading-none font-bold tracking-[0.25px]">
          <span className="text-[37px] font-extralight">karo.vision</span>
          <span>Home&nbsp;Cloud</span>
        </h2>
      </div>
      <div className="fade-in animate-in fill-mode-both flex flex-col items-center gap-9 delay-[1.5s] duration-700">
        <p className="text-muted-foreground text-lg leading-0.5">
          Get started by selecting a folder with your media.
        </p>
        <Button className="h-12 px-4! text-lg font-bold">
          <Folder className="size-[18px] leading-1" /> Select Folder
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
