import { useRef, useState } from "react";
import { useVideoPreview } from "./video-card";
import FileTile from "@/components/file-tile";
import {
  cn,
  convertSecondsToRoundedString,
  fileThumbURL,
  fileURL,
} from "@/lib/utils";
import { CircleHelp, Info } from "lucide-react";
import Link from "next/link";

const VideoTile = ({
  video,
  ref,
}: {
  video: {
    fileId: number;
    duration: number;
    resumeTime: number | null;
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
  const playerRef = useRef<HTMLVideoElement>(null);
  const { isShowingPreview, startPreview, stopPreview, onPlayerReady } =
    useVideoPreview({ playerRef });
  // Wether this file is corrupted or not, in this case if we could find a thumbnail.
  const [hasThumb, setHasThump] = useState(true);
  const [isPlayable, setIsPlayable] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  return (
    <Link href={`/videos/${video.fileId}`}>
      <FileTile
        ref={ref}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
      >
        <FileTile.Top>
          {!hasThumb ? (
            <div
              style={{ aspectRatio: "16 / 9" }}
              className="w-full flex items-center justify-center"
            >
              <CircleHelp className="text-muted-foreground h-3/4 w-3/4" />
            </div>
          ) : isShowingPreview ? (
            <video
              src={fileURL(video.fileId)}
              playsInline
              autoPlay
              muted
              controls={false}
              onPlay={onPlayerReady}
              onSeeked={onPlayerReady}
              ref={playerRef}
              width={400}
              height={225}
              loop
              // Note (15.01.2025): The rounded-t class should not be necessary since FileTile.Top is
              // already rounded-t, but for some reason it only works for the image and not the video.
              className="rounded-t w-full"
              style={{ aspectRatio: "16 / 9" }}
              poster={fileThumbURL(video.fileId)}
              onError={() => setIsPlayable(false)}
            />
          ) : (
            <img
              src={fileThumbURL(video.fileId)}
              loading="lazy"
              style={{ aspectRatio: "16 / 9" }}
              className={cn(
                "w-full object-contain transition-opacity duration-300",
                {
                  "opacity-0": !hasInitiallyLoaded,
                },
              )}
              onError={(e) => {
                setHasThump(false);
              }}
              onLoad={(e) => {
                if (!hasInitiallyLoaded) {
                  e.currentTarget.classList.add("opacity-100");
                  setHasInitiallyLoaded(true);
                }
              }}
            />
          )}
          <div className="absolute bottom-2 right-1.5 rounded-sm bg-black/45 px-2 py-1 text-[0.8rem] font-medium backdrop-blur-lg text-border">
            {convertSecondsToRoundedString(video.duration)}
          </div>
          {!isPlayable && (
            <div className="absolute h-8 w-40 top-1/2 left-1/2 -ml-[80px] -mt-4 flex justify-center items-center rounded-sm bg-black/45 text-sm font-medium backdrop-blur-lg text-border group-hover:opacity-100 opacity-0 transition-opacity">
              <Info className="w-5 h-5 mr-1.5" /> Can't play video
            </div>
          )}
        </FileTile.Top>
        <FileTile.Bottom content={video.file} />
      </FileTile>
    </Link>
  );
};

export default VideoTile;
