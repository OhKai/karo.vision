import Image from "next/image";
import { useRef } from "react";
import { useVideoPreview } from "./video-card";
import FileTile from "@/components/file-tile";
import { convertSecondsToRoundedString } from "@/lib/utils";

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
            // Note (15.01.2025): The rounded-t class should not be necessary since FileTile.Top is
            // already rounded-t, but for some reason it only works for the image and not the video.
            className="w-full rounded-t"
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
        <div className="absolute bottom-2 right-1.5 rounded-sm bg-black/45 px-2 py-1 text-[0.8rem] font-medium backdrop-blur-lg text-border">
          {convertSecondsToRoundedString(video.duration)}
        </div>
      </FileTile.Top>
      <FileTile.Bottom content={video.file} />
    </FileTile>
  );
};

export default VideoTile;
