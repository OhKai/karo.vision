import { MouseEventHandler, useState } from "react";
import FileTile from "@/components/file-tile";
import { cn, fileThumbURL, fileURL } from "@/lib/utils";
import { CircleHelp, ImageOff } from "lucide-react";
import Link from "next/link";

const PhotoTile = ({
  photo,
  ref,
  onClick,
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
  onClick?: MouseEventHandler<HTMLDivElement>;
}) => {
  const [hasThumb, setHasThumb] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  return (
    <Link href={`/photos/${photo.fileId}`} target="_blank">
      <FileTile ref={ref} onClick={onClick}>
        <FileTile.Top>
          {!hasThumb ? (
            <div
              style={{ aspectRatio: "16 / 9" }}
              className="flex w-full items-center justify-center"
            >
              <CircleHelp className="text-muted-foreground h-3/4 w-3/4" />
            </div>
          ) : (
            <img
              src={fileThumbURL(photo.fileId)}
              alt=""
              loading="lazy"
              style={{ aspectRatio: "16 / 9" }}
              className={cn(
                "w-full object-contain transition-all duration-300 group-hover:scale-105",
                {
                  "opacity-0": !hasInitiallyLoaded,
                },
              )}
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
        </FileTile.Top>
        <FileTile.Bottom content={photo.file} />
      </FileTile>
    </Link>
  );
};

export default PhotoTile;
