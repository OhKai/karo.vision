import FileCard from "@/components/file-card";
import { convertSecondsToRoundedString } from "@/lib/utils";
import Image from "next/image";
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
    if (startSeeking === -1) {
      setStartSeeking(1);
    } else {
      setStartSeeking((oldVal) => (oldVal + 1) % 5);
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

  return (
    <FileCard ref={ref} onMouseEnter={startPreview} onMouseLeave={stopPreview}>
      <FileCard.Left>
        {isShowingPreview ? (
          <video
            src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%200.7923510988921678.mp4"
            playsInline
            autoPlay
            muted
            controls={false}
            onPlay={onPlayerReady}
            onSeeked={onPlayerReady}
            ref={playerRef}
            width={400}
            height={225}
            className="w-[400px] h-[225px]"
            poster="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
          />
        ) : (
          <Image
            src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
            alt=""
            width={400}
            height={225}
          />
        )}
        <div className="absolute bottom-2 right-1.5 rounded-sm bg-black/45 px-2 py-1 text-[0.8rem] font-medium backdrop-blur-lg text-border">
          {convertSecondsToRoundedString(video.duration)}
        </div>
      </FileCard.Left>
      <FileCard.Right content={video.file} />
    </FileCard>
  );
};

export default VideoCard;
