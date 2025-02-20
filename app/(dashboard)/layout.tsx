import Image from "next/image";
import HeaderNav from "./header-nav";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col justify-items-center min-h-screen pb-20">
      <header className="grid grid-cols-3 items-center justify-items-center w-full md:px-6 px-2 text-muted-foreground border-b border-secondary h-[70px] fixed z-50 backdrop-blur-sm bg-background/[97%]">
        <div className="items-center gap-2 justify-self-start select-none md:flex hidden">
          <Image
            src="/logo.png"
            alt="Karo.Vision Home Cloud"
            width={48}
            height={31}
            className="invert-[.145]"
          />
          <h2 className="text-base font-bold flex flex-col leading-none tracking-[0.25px]">
            <span className="text-xs">karo.vision</span>
            <span>Home&nbsp;Cloud</span>
          </h2>
        </div>
        <HeaderNav className="col-start-2" />
        <Button
          className="justify-self-end"
          size="icon"
          variant="icon"
          title="Settings"
        >
          <Settings className="w-auto! h-auto!" />
        </Button>
      </header>
      <main className="mt-[70px] w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
