"use client";

import Tags from "@/components/tags";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRightToLine,
  Camera,
  Download,
  EllipsisVertical,
  FolderOpen,
  House,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import MediaThemeYtElement from "player.style/yt.js";
import MediaThemeYt from "player.style/yt/react";
import { useEffect, useRef, useState } from "react";
import MetaEditor from "./meta-editor";
import { fileURL } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import PlayerError from "./player-error";
import Link from "next/link";

const Player = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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

  return (
    <div
      className="md:h-screen flex md:overflow-hidden group md:flex-row flex-col"
      data-userinactive={isUserInactive}
      data-mediapaused={isMediaPaused}
    >
      <Link href="/">
        <Button
          className="absolute left-[9px] top-4 backdrop-blur-lg bg-black/30 group-data-[userinactive=true]:group-data-[mediapaused=false]:[&:not(:hover)]:opacity-0 transition-opacity z-10"
          title="Back to home page"
        >
          <House />
        </Button>
      </Link>
      {isConvertable ? (
        <div className="w-full h-full bg-secondary flex items-center justify-center">
          <PlayerError />
        </div>
      ) : (
        <MediaThemeYt className="w-full h-full" ref={playerRef}>
          <video
            slot="media"
            className="w-full h-full bg-foreground"
            src={fileURL(videoId)}
            playsInline
            autoPlay
          ></video>
        </MediaThemeYt>
      )}
      <div
        className="md:w-[350px] shrink-0 bg-white flex flex-col px-4 py-4 relative md:data-[opened=false]:-mr-[350px] mr-0 md:transition-all md:duration-500 group/sidebar"
        data-opened={isSidebarOpen}
      >
        <Button
          className="absolute -left-[57px] backdrop-blur-lg bg-black/30 group-data-[userinactive=true]:group-data-[mediapaused=false]:[&:not(:hover)]:opacity-0 transition-opacity hidden md:flex"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          title="Toggle sidebar"
        >
          <ArrowRightToLine className="group-data-[opened=false]/sidebar:-rotate-180 transition-transform duration-500" />
        </Button>
        {isEditing ? (
          <MetaEditor onClose={() => setIsEditing(false)} />
        ) : (
          <>
            <h4 className="text-title text-[15px] font-medium mb-[3px]">
              Youtube
            </h4>
            <h3 className="text-xl font-medium tracking-[0.25px] mb-5">
              Credit Card
            </h3>
            <div className="flex flex-col grow overflow-auto px-4 -mx-4">
              <Tags
                values={[
                  "favoritesdssdldsf sdfkdsksdfsd abcddssdldsf sdfkdsksdfsd abcd dssdldsf sdfkdsksdfsd abcd",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={2}
                expandable
                className="mb-7"
              />
              <div className="grid grid-cols-2 text-xs font-light justify-between text-secondary-foreground gap-2.5 mb-8">
                <span>05.06.2024</span>
                <span>1 GB</span>
                <span>1024x720</span>
                <span>60 FPS</span>
                <span className="truncate col-span-2">
                  /downloads/new/downloads/new/downloads/new/downloads/new
                </span>
              </div>
              <div className="text-sm text-secondary-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                blandit, justo nec lacin ia fermentum, nunc nisl ultricies nunc,
                nec a ugue lacus augue sit amet erat. Nulla facilisi. Ut sit
                amet libero vitae magna fringilla aliquam. Nam euismod, turpis
                ac malesuada tincidunt, odio mi ultricies lacus, a varius mi
                odio nec ligula. Phasellus ac ligula nec nunc ultricies
                ultricies. Nullam blandit, justo nec lacinia fermentum, nunc
                nisl ultricies nunc, nec augue lacus augue sit amet erat. Nulla
                facilisi. Ut sit amet libero vitae magna fringilla aliquam. Nam
                euismod, turpis ac malesuada tincidunt, odio mi ultricies lacus,
                a varius mi odio nec ligula. Phasellus ac ligula nec nunc
                ultricies ultricies. Nullam blandit, justo nec lacinia
                fermentum, nunc nisl ultricies nunc, nec augue lacus augue sit
                amet erat. Nulla facilisi. Ut sit amet libero vitae magna
                fringilla aliquam. Nam euismod, tur pis ac malesuada tincidunt,
                odio mi ultricies lacus, a varius mi odio nec ligula. Phasellus
                ac ligula nec nunc ultricies ultricies. Nullam blandit, justo
                nec lacinia fermentum, nunc nisl ultricies nunc, nec augue lacus
                augue sit amet erat. Nulla facilisi. Ut sit amet libero vitae
                magna fringilla aliquam. Nam euismod, turpis ac malesuada
                tincidunt, odio mi ultricies lacus, a varius mi odio nec ligula.
                Phasellus ac ligula nec nunc ultricies ultricies. Nullam
                blandit, justo nec lacinia fermentum, nunc nisl ultricies nunc,
                nec augue lacus augue sit amet erat. Nulla facilisi. Ut sit amet
                libero vitae magna fringilla aliquam. Nam euismod, tur pis ac
                malesuada tincidunt, odio mi ultricies lacus, a varius mi odio
                nec ligula. Phasellus ac ligula nec nunc ultricies ultricies.
                Nullam blandit, justo nec lacinia ferment um, nunc nisl
                ultricies nunc, nec augue lacus augue sit amet erat. Nulla
                facilisi. Ut sit amet libero vitae magna fringilla aliquam. Nam
                eu ismod, turpis ac malesuada tincidunt, odio mi ultricies
                lacus, a varius mi odio nec ligula. Phasellus ac ligula nec nunc
                ultricies ultricies. Nullam blandit, justo nec lacinia
                fermentum, nunc nisl ultricies nunc, nec augue lacus augue sit
                amet erat. Nulla facilisi. Ut sit amet libero vitae magna
                fringilla aliquam. Nam euismod, tur pis ac malesuada tincidunt,
                odio mi ultricies lacus, a varius mi odio nec ligula. Phasellus
                ac ligula nec nunc ultricies ultricies. Nullam blandit, justo
                nec lacinia ferment um, nunc nisl ultricies nunc, nec augue
                lacus augue sit amet erat. Nulla facilisi. Ut sit amet libero
                vitae magna fringilla aliquam. Nam eu ismod, turpis ac malesuada
                tincidunt, odio mi ultricies lacus, a varius mi odio nec ligula.
                Phasellus ac ligula nec nunc ultricies ultricies. Nullam
                blandit, justo nec lacinia fermentum, nunc nisl ultricies nunc,
                nec augue lacus augue sit amet erat. Nulla facilisi.
              </div>
            </div>
            <div className="flex gap-2.5 flex-col mt-3.5">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Player;
