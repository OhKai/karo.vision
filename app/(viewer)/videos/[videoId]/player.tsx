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
  Camera,
  Download,
  EllipsisVertical,
  FolderOpen,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import MediaThemeYtElement from "player.style/yt.js";
import MediaThemeYt from "player.style/yt/react";
import { useEffect, useRef, useState } from "react";
import MetaEditor from "@/components/meta-editor";
import { convertBytesToRoundedString, fileURL, roundFPS } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import PlayerError from "./player-error";
import { trpc } from "@/lib/trpc-client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { MediaViewerLayout } from "@/components/media-viewer-layout";

const Player = () => {
  const playerRef = useRef<MediaThemeYtElement>(null);
  const [isUserInactive, setUserInactive] = useState(true);
  const [isMediaPaused, setMediaPaused] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isConvertable, setIsConvertable] = useState(false);
  const params = useParams();
  // TODO: remove this test to see what it is in production
  console.log(params);
  // Note: This should always be a number since we check it server-side before returning this page.
  const videoId = parseInt(usePathname().split("/").pop()!);
  const queryClient = useQueryClient();
  const { data: video, isPending } = useQuery(
    trpc.videos.byId.queryOptions(videoId),
  );

  const videoMutationOptions = trpc.videos.update.mutationOptions({
    onSuccess: (data) => {
      // Since everything is local, we can be aggressive with busting the cache.
      queryClient.invalidateQueries({
        queryKey: trpc.videos.list.infiniteQueryKey(),
      });
      // Invalidate and wait for the specific video data to be refetched.
      return queryClient.invalidateQueries({
        queryKey: trpc.videos.byId.queryKey(videoId),
      });
    },
  });

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleUserInactive = (e: any) => {
      setUserInactive(e.detail);
    };

    const handlePause = (e: any) => {
      setMediaPaused(e.detail);
    };

    const handleErrorCode = (e: any) => {
      // Code 4 = source not supported
      if (e.detail === 4) {
        // TODO: Only show this for viable formats?
        setIsConvertable(true);
      }
    };

    // Event types: https://media-chrome.mux.dev/examples/vanilla/state-change-events-demo.html
    player.addEventListener("userinactivechange", handleUserInactive);
    player.addEventListener("mediapaused", handlePause);
    player.addEventListener("mediaerrorcode", handleErrorCode);

    return () => {
      player.removeEventListener("userinactivechange", handleUserInactive);
      player.removeEventListener("mediapaused", handlePause);
      player.removeEventListener("mediaerrorcode", handleErrorCode);
    };
  }, []);

  const onPlayerControlPointerMove = (e: React.PointerEvent) => {
    // Treat the button as a player control element to prevent the other controls from
    // hiding when the mouse is over it. The corresponding logic in the player will set
    // userInactive to false and prevent a timeout from hiding the controls, since the
    // button as event target is not the player element. See:
    // https://github.com/muxinc/media-chrome/blob/3290efcca50f38ba27a869e7e681ed0a35f05d94/src/js/media-container.ts#L563
    playerRef.current?.mediaController.handleEvent(e.nativeEvent);
  };

  const onPlayerControlMouseLeave = (e: React.MouseEvent) => {
    // Handle mouseleave event to check if the mouse is leaving the parent container without
    // firing a mouseleave event on the player (if moving the mouse quickly out of the
    // window). This is necessary because otherwise the controls would not be hidden like
    // they are when the mouse is leaving the player.

    // Check if the mouse is leaving to go outside the player container. (No instanceof Node
    // if out of window)
    const isLeavingPlayer = !(
      e.relatedTarget instanceof Node &&
      playerRef.current?.contains(e.relatedTarget)
    );

    if (isLeavingPlayer) {
      // HACK: The player logic expects a mouseleave event when leaving the container, but
      // the nativeEvent prop on this react event is of type mouseout. So we call the
      // handler with the react event instead, since only the type is looked at anyway.
      playerRef.current?.mediaController.handleEvent(e as any);
    }
  };

  const showControls = isMediaPaused || !isUserInactive;

  return (
    <MediaViewerLayout showControls={showControls}>
      <MediaViewerLayout.HomeButton
        onPointerMove={onPlayerControlPointerMove}
        onMouseLeave={onPlayerControlMouseLeave}
      />
      <MediaViewerLayout.MediaContent>
        {isConvertable ? (
          <div className="bg-secondary flex h-full w-full items-center justify-center">
            <PlayerError />
          </div>
        ) : (
          <MediaThemeYt className="h-full w-full" ref={playerRef}>
            <video
              slot="media"
              className="bg-foreground h-full w-full"
              src={fileURL(videoId)}
              playsInline
              autoPlay
            ></video>
          </MediaThemeYt>
        )}
      </MediaViewerLayout.MediaContent>
      <MediaViewerLayout.Sidebar
        toggleButtonProps={{
          onPointerMove: onPlayerControlPointerMove,
          onMouseLeave: onPlayerControlMouseLeave,
        }}
      >
        {isPending ? null : !video ? (
          <div>Video metadata could not be loaded.</div>
        ) : isEditing ? (
          <MetaEditor
            file={{
              id: video.file.id,
              name: video.file.name,
              topic: video.file.topic,
              title: video.file.title,
              tags: video.file.tags,
              description: video.description,
            }}
            fileType="video"
            onClose={() => setIsEditing(false)}
            mutationOptions={videoMutationOptions}
            topicSuggestions={["Youtube", "Twitch", "Movies", "TV Shows"]}
          />
        ) : (
          <>
            <MediaViewerLayout.SidebarInfo
              topic={video.file.topic}
              title={video.file.title ?? video.file.name}
              tags={video.file.tags ?? []}
              description={video.description}
            >
              <span>{video.file.createdAt.toLocaleDateString()}</span>
              <span>{convertBytesToRoundedString(video.file.size)}</span>
              <span>
                {video.width}x{video.height}
              </span>
              <span>{roundFPS(video.framerate)} FPS</span>
              <span className="col-span-2 truncate">{video.file.dirname}</span>
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
                      <Camera />
                      <span>Set as thumbnail</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FolderOpen />
                      <span>Reveal in Finder</span>
                      <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download />
                      <span>Download video</span>
                      <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw />
                      <span>Sync player</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
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

export default Player;
