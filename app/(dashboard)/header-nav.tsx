"use client";

import { TvMinimalPlay, Image as LImage, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSelectedLayoutSegment } from "next/navigation";

type HeaderNavProps = {
  className?: string;
};

const HeaderNav = ({ className }: HeaderNavProps) => {
  const segment = useSelectedLayoutSegment();
  console.log(segment);

  return (
    <nav className={cn("flex gap-6", className)}>
      <Button
        asChild
        size="icon"
        variant="ghost"
        data-active={segment === null}
        className="size-10 relative data-[active=true]:text-accent-foreground data-[active=true]:after:block data-[active=true]:after:size-1 data-[active=true]:after:absolute data-[active=true]:after:-bottom-1.5 data-[active=true]:after:rounded-full data-[active=true]:after:bg-accent-foreground"
      >
        <Link href="/" title="Videos">
          <TvMinimalPlay className="size-6" />
        </Link>
      </Button>
      <Button
        asChild
        size="icon"
        variant="ghost"
        data-active={segment === "photos"}
        className="size-10 relative data-[active=true]:text-accent-foreground data-[active=true]:after:block data-[active=true]:after:size-1 data-[active=true]:after:absolute data-[active=true]:after:-bottom-1.5 data-[active=true]:after:rounded-full data-[active=true]:after:bg-accent-foreground"
      >
        <Link href="/photos" title="Photos">
          <LImage className="size-6" />
        </Link>
      </Button>
      <Button
        asChild
        size="icon"
        variant="ghost"
        data-active={segment === "music"}
        className="size-10 relative data-[active=true]:text-accent-foreground data-[active=true]:after:block data-[active=true]:after:size-1 data-[active=true]:after:absolute data-[active=true]:after:-bottom-1.5 data-[active=true]:after:rounded-full data-[active=true]:after:bg-accent-foreground"
      >
        <Link href="/music" title="Music">
          <Music className="size-6" />
        </Link>
      </Button>
    </nav>
  );
};

export default HeaderNav;
