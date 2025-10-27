"use client";

import { FastForward, Pause, Play, Rewind } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/lib/use-audio-player";

const MiniAudioPlayer = () => {
  const audioPlayer = useAudioPlayer();

  if (!audioPlayer.currentTrackId) {
    return null;
  }

  return (
    <div className="bg-background/97 absolute top-[100dvh] -mt-[70px] flex h-[70px] w-full flex-col-reverse backdrop-blur-sm min-[940px]:top-0 min-[940px]:left-1/2 min-[940px]:mt-0 min-[940px]:ml-[150px] min-[940px]:w-[250px] min-[940px]:flex-col min-[940px]:bg-transparent min-[940px]:backdrop-blur-none xl:ml-[250px] xl:w-[300px]">
      <div className="flex flex-1 items-center">
        <div className="ml-2 min-[940px]:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => audioPlayer.rewind()}
          >
            <Rewind />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => audioPlayer.togglePlayPause()}
          >
            {audioPlayer.isPlaying ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => audioPlayer.fastForward()}
          >
            <FastForward />
          </Button>
        </div>
        <Link
          href={"/music" + (audioPlayer.query ? `?${audioPlayer.query}` : "")}
          className="hover:bg-primary-foreground h-full flex-1 content-center overflow-hidden px-1 transition-colors"
          title="Go to playlist"
        >
          <h4 className="truncate text-[13px]">
            {audioPlayer.currentTrack?.file.topic}
          </h4>
          <h3 className="truncate text-[17px] font-medium tracking-[0.25px]">
            {audioPlayer.currentTrack?.file.title ??
              audioPlayer.currentTrack?.file.name}
          </h3>
        </Link>
      </div>
      <div className="bg-muted h-1">
        <div
          className="bg-primary h-full transition-all"
          style={{
            width: `${(
              (audioPlayer.currentTime /
                (audioPlayer.currentTrack?.duration ?? 1)) *
              100
            ).toFixed(3)}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default MiniAudioPlayer;
