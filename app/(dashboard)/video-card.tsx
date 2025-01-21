import FileCard from "@/components/file-card";
import {
  convertSecondsToRoundedString,
  fileThumbURL,
  fileURL,
} from "@/lib/utils";
import { CircleHelp, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const useVideoPreview = ({
  playerRef,
}: {
  playerRef: React.RefObject<HTMLVideoElement | null>;
}) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const [startSeeking, setStartSeeking] = useState(-1);

  useEffect(() => {
    // End the preview after 40 seconds to avoid infinite loops.
    let to: number;
    if (isShowingPreview) {
      to = window.setTimeout(() => {
        setIsShowingPreview(false);
        setStartSeeking(-1);
      }, 40 * 1000);
    }

    return () => window.clearTimeout(to);
  }, [isShowingPreview]);

  useEffect(() => {
    let timer: number;
    if (startSeeking > -1) {
      timer = window.setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.currentTime =
            0.2 * startSeeking * playerRef.current.duration;
        }
      }, 3000);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [startSeeking]);

  const onPlayerReady = () => {
    // No need to seek if the video is less than 15 seconds.
    if ((playerRef.current?.duration ?? 0) > 15) {
      if (startSeeking === -1) {
        setStartSeeking(1);
      } else {
        setStartSeeking((oldVal) => (oldVal + 1) % 5);
      }
    }
  };

  return {
    isShowingPreview,
    startPreview: () => {
      setIsShowingPreview(true);
    },
    stopPreview: () => {
      setIsShowingPreview(false);
      setStartSeeking(-1);
    },
    onPlayerReady,
  };
};

const VideoCard = ({
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

  return (
    <Link href={`/videos/${video.fileId}`}>
      <FileCard
        ref={ref}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
      >
        <FileCard.Left>
          {!hasThumb ? (
            <CircleHelp className="text-muted-foreground h-[150px] w-[150px]" />
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
              className="w-[400px] h-[225px]"
              poster={fileThumbURL(video.fileId)}
              onError={() => setIsPlayable(false)}
            />
          ) : (
            <img
              src={fileThumbURL(video.fileId)}
              loading="lazy"
              className="max-w-full max-h-full"
              onError={(e) => {
                setHasThump(false);
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
        </FileCard.Left>
        <FileCard.Right content={video.file} />
      </FileCard>
    </Link>
  );
};

export default VideoCard;
