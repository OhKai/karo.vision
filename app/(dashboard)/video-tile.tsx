import FileCard from "@/components/file-card";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useVideoPreview } from "./video-card";
import FileTile from "@/components/file-tile";

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

  return (
    <FileTile ref={ref} onMouseEnter={startPreview} onMouseLeave={stopPreview}>
      <FileTile.Top>
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
            className="w-full"
            poster="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
          />
        ) : (
          <Image
            src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
            alt=""
            width={400}
            height={225}
            className="w-full"
          />
        )}
      </FileTile.Top>
      <FileTile.Bottom content={video.file} />
    </FileTile>
  );
};

export default VideoTile;
