import { TvMinimalPlay, Image as LImage, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type HeaderNavProps = {
  className?: string;
};

const HeaderNav = ({ className }: HeaderNavProps) => {
  return (
    <nav className={cn("flex gap-5", className)}>
      <Button
        asChild
        size="icon"
        variant="icon"
        data-active="true"
        className="relative data-[active=true]:text-title data-[active=true]:hover:text-secondary-foreground data-[active=true]:after:block data-[active=true]:after:w-1 data-[active=true]:after:h-1 data-[active=true]:after:absolute data-[active=true]:after:-bottom-1.5 data-[active=true]:after:rounded-full data-[active=true]:after:bg-title"
      >
        <Link href="/" title="Videos">
          <TvMinimalPlay className="!w-auto !h-auto" />
        </Link>
      </Button>
      <Button
        asChild
        size="icon"
        variant="icon"
        data-active="false"
        className="relative data-[active=true]:text-title data-[active=true]:hover:text-secondary-foreground data-[active=true]:after:block data-[active=true]:after:w-1 data-[active=true]:after:h-1 data-[active=true]:after:absolute data-[active=true]:after:-bottom-1.5 data-[active=true]:after:rounded-full data-[active=true]:after:bg-title"
      >
        <Link href="/photos" title="Photos">
          <LImage className="!w-auto !h-auto" />
        </Link>
      </Button>
      <Button
        asChild
        size="icon"
        variant="icon"
        data-active={false}
        className="relative data-[active=true]:text-title data-[active=true]:hover:text-secondary-foreground data-[active=true]:after:block data-[active=true]:after:w-1 data-[active=true]:after:h-1 data-[active=true]:after:absolute data-[active=true]:after:-bottom-1.5 data-[active=true]:after:rounded-full data-[active=true]:after:bg-title"
      >
        <Link href="/music" title="Music">
          <Music className="!w-auto !h-auto" />
        </Link>
      </Button>
    </nav>
  );
};

export default HeaderNav;
