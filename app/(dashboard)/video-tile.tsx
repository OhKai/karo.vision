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

const VideoTile = ({
  video,
  ref,
  onClick,
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
  onClick?: () => void;
}) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const { isShowingPreview, startPreview, stopPreview, onPlayerReady } =
    useVideoPreview({ playerRef });
  // Wether this file is corrupted or not, in this case if we could find a thumbnail.
  const [hasThumb, setHasThump] = useState(true);
  const [isPlayable, setIsPlayable] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  return (
    <FileTile
      ref={ref}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onClick={onClick}
    >
      <FileTile.Top>
        {!hasThumb ? (
          <div
            style={{ aspectRatio: "16 / 9" }}
            className="flex w-full items-center justify-center"
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
            className="w-full rounded-t"
            style={{ aspectRatio: "16 / 9" }}
            poster={fileThumbURL(video.fileId)}
            // TODO: Unset isPlayable if the video can be played after an error occured first (e.g. reconnecting to the server).
            onError={() => setIsPlayable(false)}
          />
        ) : (
          <img
            src={fileThumbURL(video.fileId)}
            alt=""
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
        <div className="bg-foreground/45 text-background absolute right-1.5 bottom-2 rounded-sm px-2 py-1 text-[0.8rem] font-medium backdrop-blur-lg">
          {convertSecondsToRoundedString(video.duration)}
        </div>
        {!isPlayable && (
          <div className="text-border absolute top-1/2 left-1/2 -mt-4 -ml-[80px] flex h-8 w-40 items-center justify-center rounded-sm bg-black/45 text-sm font-medium opacity-0 backdrop-blur-lg transition-opacity group-hover:opacity-100">
            <Info className="mr-1.5 h-5 w-5" /> Can't play video
          </div>
        )}
      </FileTile.Top>
      <FileTile.Bottom content={video.file} />
    </FileTile>
  );
};

export default VideoTile;
