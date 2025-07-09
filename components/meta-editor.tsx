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
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const formSchema = z.object({
  topic: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
});

export type MetaEditorFile = {
  id: number;
  name: string;
  topic: string | null;
  title: string | null;
  tags: string[] | null;
  description?: string | null;
};

export type MetaEditorProps<T, E, C> = {
  file: MetaEditorFile;
  fileType?: string;
  onClose: () => void;
  mutationOptions: UseMutationOptions<
    T,
    E,
    {
      videoId: number;
      topic?: string | null;
      title?: string | null;
      tags?: string[] | null;
      description?: string | null;
    },
    C
  >;
  topicSuggestions?: string[];
  tagSuggestions?: string[];
};

const MetaEditor = <T, E, C>({
  file,
  fileType = "file",
  onClose,
  mutationOptions,
  topicSuggestions = [],
  tagSuggestions = [],
}: MetaEditorProps<T, E, C>) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: file.topic ?? "",
      title: file.title ?? "",
      tags: file.tags ?? [],
      description: file.description ?? "",
    },
  });

  const mutation = useMutation(mutationOptions);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(
      {
        videoId: file.id,
        // Ensure empty values stay null.
        topic: values.topic || null,
        title: values.title || null,
        tags: values.tags.length === 0 ? null : values.tags,
        description: values.description || null,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
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
                    items={topicSuggestions.map((topic) => ({
                      value: topic,
                      label: topic,
                    }))}
                    popoverClassName={""}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Group your {fileType}s by topic to keep them organized.
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
                  Give a custom title to your {fileType}. This will not change
                  the filename on disk. Special characters are allowed.
                </FormDescription>
                <div className="flex items-center text-xs break-all text-zinc-400">
                  <Info className="mr-1.5 size-4 shrink-0" /> Filename:&nbsp;
                  {file.name}
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
                    items={tagSuggestions.map((tag) => ({
                      value: tag,
                      label: tag,
                    }))}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Assign as many tags as you want to the {fileType}. Tags are
                  used to filter for similar {fileType}s in the library.
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
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MetaEditor;
