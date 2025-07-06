import { useState } from "react";
import { cn, fileURL } from "@/lib/utils";
import { CircleHelp } from "lucide-react";
import Link from "next/link";

const PhotoPoster = ({
  photo,
  ref,
}: {
  photo: {
    fileId: number;
    width: number | null;
    height: number | null;
    file: {
      topic: string | null;
      title: string | null;
      tags: string[] | null;
      dirname: string;
      createdAt: Date;
      size: number;
      name: string;
    };
  };
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const [hasThumb, setHasThumb] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  return (
    <Link href={`/photos/${photo.fileId}`} className="w-full">
      <div
        className="bg-muted hover:bg-input group flex w-full justify-center overflow-hidden rounded shadow-xs transition-colors"
        ref={ref}
      >
        {!hasThumb ? (
          <div className="flex w-full items-center justify-center">
            <CircleHelp className="text-muted-foreground h-3/4 w-3/4" />
          </div>
        ) : (
          <img
            src={fileURL(photo.fileId)}
            alt=""
            loading="lazy"
            className={cn(
              "w-full rounded transition-all duration-300 group-hover:scale-105",
              {
                "opacity-0": !hasInitiallyLoaded,
              },
            )}
            style={{
              width: "100%",
            }}
            onError={() => {
              setHasThumb(false);
            }}
            onLoad={(e) => {
              if (!hasInitiallyLoaded) {
                e.currentTarget.classList.add("opacity-100");
                setHasInitiallyLoaded(true);
              }
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default PhotoPoster;
