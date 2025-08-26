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
  FolderOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import { ReactNode, useState } from "react";
import MetaEditor from "@/components/meta-editor";
import { cn, convertBytesToRoundedString, fileURL } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MediaViewerLayout } from "@/components/media-viewer-layout";
import z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type PhotoViewerProps = {
  photoId: number;
  fullscreen?: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children?: ReactNode;
};

const PhotoViewer = ({
  photoId,
  fullscreen = false,
  isSidebarOpen,
  setIsSidebarOpen,
  children,
}: PhotoViewerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { data: photo, isPending } = useQuery(
    trpc.photos.byId.queryOptions(photoId),
  );

  const photoMutationOptions = trpc.photos.update.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.photos.list.infiniteQueryKey(),
      });
      return queryClient.invalidateQueries({
        queryKey: trpc.photos.byId.queryKey(photoId),
      });
    },
  });

  return (
    <MediaViewerLayout
      showControls={true}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      className={cn({ "md:h-screen": fullscreen })}
    >
      <MediaViewerLayout.MediaContent>
        {children}
        <div className="bg-foreground flex h-full w-full items-center justify-center">
          <img
            src={fileURL(photoId)}
            alt={photo?.file.title || photo?.file.name || "Photo"}
            className="h-full w-full object-contain"
            width={photo?.width}
            height={photo?.height}
          />
        </div>
      </MediaViewerLayout.MediaContent>
      <MediaViewerLayout.Sidebar
        toggleButtonProps={{ className: "opacity-0 group-hover:opacity-100" }}
      >
        {isPending ? null : !photo ? (
          <div>Photo metadata could not be loaded.</div>
        ) : isEditing ? (
          <MetaEditor
            file={{
              fileId: photo.file.id,
              name: photo.file.name,
              topic: photo.file.topic,
              title: photo.file.title,
              tags: photo.file.tags,
            }}
            fileType="photo"
            onClose={() => setIsEditing(false)}
            mutationOptions={photoMutationOptions}
            topicSuggestions={["Nature", "Portrait", "Architecture", "Street"]}
            additionalSchema={z.object({
              description: z.string(),
            })}
            additionalDefaults={{ description: photo.description ?? "" }}
            renderAdditional={(form) => (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        className="text-accent-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
        ) : (
          <>
            <MediaViewerLayout.SidebarInfo
              topic={photo.file.topic}
              title={photo.file.title ?? photo.file.name}
              tags={photo.file.tags ?? []}
              description={photo.description}
              dialogClose={!fullscreen}
            >
              <span>{photo.file.createdAt.toLocaleDateString()}</span>
              <span>{convertBytesToRoundedString(photo.file.size)}</span>
              <span>
                {photo.width}x{photo.height}
              </span>
              <span className="col-span-2 truncate">{photo.file.dirname}</span>
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
                      <span>Download photo</span>
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

export default PhotoViewer;
