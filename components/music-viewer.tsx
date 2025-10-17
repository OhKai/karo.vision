"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  EllipsisVertical,
  FastForward,
  FolderOpen,
  Pause,
  Pencil,
  Play,
  Rewind,
  SkipForward,
  Trash2,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import MetaEditor from "@/components/meta-editor";
import {
  cn,
  convertBytesToRoundedString,
  convertSecondsToRoundedString,
  fileURL,
} from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MediaViewerLayout } from "@/components/media-viewer-layout";
import { Wave } from "@foobar404/wave";
import { useAudioPlayer } from "@/lib/use-audio-player";
import useChange from "@/lib/use-change";
import { useQueryParams } from "@/lib/use-query-params";
import { Slider } from "./ui/slider";

const initAudioVisualizer = (
  wave: Wave,
  size: { width: number; height: number },
) => {
  wave.clearAnimations();

  wave.addAnimation(
    new wave.animations.Arcs({
      diameter: 0,
      lineWidth: 4 * window.devicePixelRatio,
      count: 2 * Math.floor(size.width / (140 * window.devicePixelRatio)),
      lineColor: "#290073",
      frequencyBand: "lows",
    }),
  );

  wave.addAnimation(
    new wave.animations.Glob({
      fillColor: {
        gradient: ["#290073", "#3d2ce4"],
        rotate: 45,
      },
      diameter: Math.min(size.width, size.height) * 0.35,
      lineWidth: 10 * window.devicePixelRatio,
      lineColor: "#290073",
      frequencyBand: "mids",
      mirroredX: true,
      glow: { strength: 15, color: "#290073" },
    }),
  );
};

type MusicViewerProps = {
  fullscreen?: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children?: ReactNode;
};

const MusicViewer = ({
  fullscreen = false,
  isSidebarOpen,
  setIsSidebarOpen,
  children,
}: MusicViewerProps) => {
  const audioPlayer = useAudioPlayer();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { data: music, isPending } = useQuery(
    trpc.music.byId.queryOptions(audioPlayer.currentTrackId!),
  );
  const { query } = useQueryParams();

  const musicMutationOptions = trpc.music.update.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.music.list.infiniteQueryKey(),
      });
      return queryClient.invalidateQueries({
        queryKey: trpc.music.byId.queryKey(audioPlayer.currentTrackId!),
      });
    },
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<Wave | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(undefined);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(
    undefined,
  );

  // TODO: Move the <audio> element to a higher level so that playback is global.
  const lastInternalUpdate = useRef(0);
  useEffect(() => {
    const el = audioRef.current;
    // Calling play() before the audio is ready stops playback even with autoPlay.
    if (!el || el.readyState === 0) return;

    audioPlayer.isPlaying ? el.play() : el.pause();
  }, [audioPlayer.isPlaying]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // Prevent feedback loop when syncing currentTime between Zustand state and audio element.
    if (lastInternalUpdate.current === audioPlayer.currentTime) return;

    el.currentTime = audioPlayer.currentTime;
  }, [audioPlayer.currentTime]);

  const syncCanvasSize = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === canvas) {
          const boxSize = entry.devicePixelContentBoxSize?.[0] ??
            entry.contentBoxSize?.[0] ?? {
              inlineSize: entry.contentRect.width,
              blockSize: entry.contentRect.height,
            };

          const cssWidth = boxSize.inlineSize;
          const cssHeight = boxSize.blockSize;

          // Fallback for browsers without devicePixelContentBoxSize
          const dpr = entry.devicePixelContentBoxSize
            ? 1
            : window.devicePixelRatio;

          const newWidth = Math.round(cssWidth * dpr);
          const newHeight = Math.round(cssHeight * dpr);

          if (canvas.width !== newWidth || canvas.height !== newHeight) {
            /**
             * We intentionally set canvas dimensions through React state rather than directly in
             * ResizeObserver callbacks to avoid flashing. The browser's frame timeline is:
             * 1. rAF callbacks (drawing)
             * 2. ResizeObserver callbacks (after rAF!)
             * 3. Browser paint
             *
             * If we resize the canvas in ResizeObserver, it clears the bitmap AFTER our rAF draw
             * but BEFORE paint, causing a flash of blank canvas. By using React state, we batch the
             * resize with React's reconciliation, ensuring the canvas resize and subsequent redraw
             * happen in a predictable order within React's render cycle.
             *
             * This is a fundamental limitation of the web platform's timing model - there's
             * currently no way to properly synchronize ResizeObserver with canvas drawing. See:
             * https://github.com/w3c/csswg-drafts/issues/9717
             */
            setCanvasWidth(newWidth);
            setCanvasHeight(newHeight);

            // Adapt animations for new canvas size.
            waveRef.current &&
              initAudioVisualizer(waveRef.current, {
                width: newWidth,
                height: newHeight,
              });
          }
        }
      }
    });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <MediaViewerLayout
      showControls={true}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      className={cn({ "md:h-screen": fullscreen })}
    >
      <MediaViewerLayout.MediaContent>
        {children}
        <div className="bg-foreground flex h-full w-full flex-col items-center justify-center">
          <canvas
            ref={syncCanvasSize}
            className="h-full min-h-0 w-full min-w-0"
            width={canvasWidth}
            height={canvasHeight}
            onClick={audioPlayer.togglePlayPause}
          ></canvas>
          <div className="bg-foreground/50 flex w-full justify-center gap-2 px-3 py-2 backdrop-blur-sm">
            <audio
              ref={(el) => {
                audioRef.current = el;

                const handlePlay = () => {
                  if (!audioPlayer.isPlaying) audioPlayer.play();
                };
                const handlePause = () => {
                  if (audioPlayer.isPlaying) audioPlayer.pause();
                };
                const handleEnded = () => {
                  if (audioPlayer.isPlaying) audioPlayer.pause();
                };
                const handleTimeUpdate = () => {
                  const currentTime = el!.currentTime;
                  lastInternalUpdate.current = currentTime;
                  audioPlayer.setCurrentTime(currentTime);
                };
                const handleWaiting = () => {
                  if (!audioPlayer.isLoading) audioPlayer.setIsLoading(true);
                };
                const handlePlaying = () => {
                  if (audioPlayer.isLoading) audioPlayer.setIsLoading(false);
                };

                el!.addEventListener("play", handlePlay);
                el!.addEventListener("pause", handlePause);
                el!.addEventListener("ended", handleEnded);
                el!.addEventListener("timeupdate", handleTimeUpdate);
                el!.addEventListener("waiting", handleWaiting);
                el!.addEventListener("playing", handlePlaying);

                return () => {
                  el!.removeEventListener("play", handlePlay);
                  el!.removeEventListener("pause", handlePause);
                  el!.removeEventListener("ended", handleEnded);
                  el!.removeEventListener("timeupdate", handleTimeUpdate);
                  el!.removeEventListener("waiting", handleWaiting);
                  el!.removeEventListener("playing", handlePlaying);
                };
              }}
              src={fileURL(audioPlayer.currentTrackId!)}
              autoPlay
              crossOrigin="anonymous"
              onLoadedMetadata={() => {
                try {
                  waveRef.current = new Wave(
                    audioRef.current!,
                    canvasRef.current!,
                  );

                  initAudioVisualizer(waveRef.current, {
                    width: canvasRef.current!.width,
                    height: canvasRef.current!.height,
                  });
                } catch (error) {
                  console.error("Failed to initialize wave", error);
                }
              }}
            />
            <Button
              className="bg-transparent"
              onClick={() => audioPlayer.rewind()}
            >
              <Rewind />
            </Button>
            <Button
              className="bg-transparent"
              onClick={() => audioPlayer.togglePlayPause()}
            >
              {audioPlayer.isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button
              className="bg-transparent"
              onClick={() => audioPlayer.fastForward()}
            >
              <FastForward />
            </Button>
            <div className="text-muted flex items-center text-xs tabular-nums">
              {convertSecondsToRoundedString(audioPlayer.currentTime)}
            </div>
            <Slider
              value={[audioPlayer.currentTime]}
              max={music?.duration}
              step={0.01}
              onValueChange={([currentTime]) => {
                audioPlayer.setCurrentTime(currentTime);
              }}
            />
            <div className="text-muted flex items-center text-xs tabular-nums">
              -
              {convertSecondsToRoundedString(
                Math.ceil((music?.duration ?? 0) - audioPlayer.currentTime),
              )}
            </div>
          </div>
        </div>
      </MediaViewerLayout.MediaContent>
      <MediaViewerLayout.Sidebar
        toggleButtonProps={{ className: "opacity-0 group-hover:opacity-100" }}
      >
        {isPending ? null : !music ? (
          <div>Music metadata could not be loaded.</div>
        ) : isEditing ? (
          <MetaEditor
            file={{
              fileId: music.file.id,
              name: music.file.name,
              topic: music.file.topic,
              title: music.file.title,
              tags: music.file.tags,
            }}
            fileType="track"
            onClose={() => setIsEditing(false)}
            mutationOptions={musicMutationOptions}
            topicSuggestions={["Nature", "Portrait", "Architecture", "Street"]}
          />
        ) : (
          <>
            <MediaViewerLayout.SidebarInfo
              topic={music.file.topic}
              title={music.file.title ?? music.file.name}
              tags={music.file.tags ?? []}
              dialogClose={!fullscreen}
            >
              <span>{music.file.createdAt.toLocaleDateString()}</span>
              <span>{convertBytesToRoundedString(music.file.size)}</span>
              <span>{music.channels}</span>
              <span>{music.sampleRate}</span>
              <span className="col-span-2 truncate">{music.file.dirname}</span>
            </MediaViewerLayout.SidebarInfo>
            <MediaViewerLayout.SidebarActions>
              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil /> Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>
                      <FolderOpen />
                      <span>Reveal in Finder</span>
                      <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download />
                      <span>Download music file</span>
                      <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button variant="destructive">
                <Trash2 /> Delete
              </Button>
            </MediaViewerLayout.SidebarActions>
          </>
        )}
      </MediaViewerLayout.Sidebar>
    </MediaViewerLayout>
  );
};

export default MusicViewer;
