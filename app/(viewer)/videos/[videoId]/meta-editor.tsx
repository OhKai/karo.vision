"use client";

import Combobox from "@/components/combobox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  topic: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
});

type MetaEditorProps = {
  onClose: () => void;
  video: {
    file: {
      id: number;
      name: string;
      topic: string | null;
      title: string | null;
      tags: string[] | null;
    };
    description: string | null;
  };
};

const MetaEditor = ({ onClose, video }: MetaEditorProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: video.file.topic ?? "",
      title: video.file.title ?? "",
      tags: video.file.tags ?? [],
      description: video.description ?? "",
    },
  });

  const utils = trpc.useUtils();

  const mutation = trpc.videos.update.useMutation({
    onSuccess: (data, vars) => {
      // Since everything is local, we can be aggressive with busting the cache.
      utils.videos.list.invalidate();
      utils.videos.byId.setData(video.file.id, data);

      onClose();
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      videoId: video.file.id,
      // Ensure empty values stay null.
      topic: values.topic || null,
      title: values.title || null,
      tags: values.tags.length === 0 ? null : values.tags,
      description: values.description || null,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col space-y-8"
      >
        <div className="-mx-4 flex-1 space-y-8 overflow-auto px-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Combobox
                    canAdd
                    items={["Youtube", "Twitch"].map((site) => ({
                      value: site,
                      label: site,
                    }))}
                    popoverClassName={""}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Group your videos by topic to keep them organized.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    className="text-accent-foreground"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Give a custom title to your video. This will not change the
                  filename on disk. Special characters are allowed.
                </FormDescription>
                <div className="flex items-center text-xs break-all text-zinc-400">
                  <Info className="mr-1.5 size-4 shrink-0" /> Filename:&nbsp;
                  {video.file.name}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Combobox
                    canAdd
                    multiple
                    items={["asd", "asdsfd"].map((tag) => ({
                      value: tag,
                      label: tag,
                    }))}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Assign as many tags as you want to the video. Tags are used to
                  filter for similar videos in the library.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        <div className="mt-3.5 flex flex-col gap-2.5">
          <Button type="submit">Save</Button>
          <Button variant="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MetaEditor;
