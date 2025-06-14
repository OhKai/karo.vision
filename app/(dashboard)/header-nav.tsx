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
        className="size-10 relative data-[active=true]:text-accent-foreground after:block after:size-1 after:absolute after:-bottom-1.5 after:rounded-full data-[active=true]:after:bg-accent-foreground after:transition-colors"
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
        className="size-10 relative data-[active=true]:text-accent-foreground after:block after:size-1 after:absolute after:-bottom-1.5 after:rounded-full data-[active=true]:after:bg-accent-foreground after:transition-colors"
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
        className="size-10 relative data-[active=true]:text-accent-foreground after:block after:size-1 after:absolute after:-bottom-1.5 after:rounded-full data-[active=true]:after:bg-accent-foreground after:transition-colors"
      >
        <Link href="/music" title="Music">
          <Music className="size-6" />
        </Link>
      </Button>
    </nav>
  );
};

export default HeaderNav;
