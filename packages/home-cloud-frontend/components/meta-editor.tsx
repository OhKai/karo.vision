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
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ReactNode } from "react";

// Base schema that all meta editors will have
const baseSchema = z.object({
  topic: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
});

// Base file type with required fields
export type MetaEditorFile = {
  fileId: number;
  name: string;
  topic: string | null;
  title: string | null;
  tags: string[] | null;
};

// Generic props that support additional schema
export type MetaEditorProps<S extends z.ZodRawShape> = {
  file: MetaEditorFile;
  fileType?: string;
  onClose: () => void;
  mutationOptions: UseMutationOptions<
    any,
    any,
    {
      fileId: number;
      topic?: string | null;
      title?: string | null;
      tags?: string[] | null;
    },
    any
  >;
  topicSuggestions?: string[];
  tagSuggestions?: string[];
  additionalSchema?: z.ZodObject<S>;
  additionalDefaults?: z.infer<z.ZodObject<S>>;
  renderAdditional?: (
    form: UseFormReturn<
      {
        topic: string;
        title: string;
        tags: string[];
      } & z.infer<z.ZodObject<S>>
    >,
  ) => ReactNode;
};

function MetaEditor<S extends z.ZodRawShape>({
  file,
  fileType = "file",
  onClose,
  mutationOptions,
  topicSuggestions = [],
  tagSuggestions = [],
  additionalSchema,
  additionalDefaults,
  renderAdditional,
}: MetaEditorProps<S>) {
  // Merge schemas if additional schema is provided
  const formSchema = additionalSchema
    ? baseSchema.merge(additionalSchema)
    : baseSchema;

  const form = useForm({
    // We treat the form as only containing the base schema fields because typescript has issues
    // with generics in this context.
    resolver: zodResolver(formSchema as typeof baseSchema),
    defaultValues: {
      topic: file.topic ?? "",
      title: file.title ?? "",
      tags: file.tags ?? [],
      ...(additionalDefaults || {}),
    },
  });

  const mutation = useMutation(mutationOptions);

  const onSubmit: SubmitHandler<{
    title: string;
    topic: string;
    tags: string[];
  }> = async (values) => {
    const { topic, title, tags, ...additionalValues } = values;

    const baseValues = {
      fileId: file.fileId,
      // Ensure empty values stay null.
      topic: topic || null,
      title: title || null,
      tags: tags.length === 0 ? null : tags,
    };

    const processedAdditionalValues = Object.entries(additionalValues).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value === "" ? null : value,
      }),
      {},
    );

    mutation.mutate(
      {
        ...baseValues,
        ...processedAdditionalValues,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

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
          {renderAdditional?.(
            form as UseFormReturn<
              {
                topic: string;
                title: string;
                tags: string[];
              } & z.infer<z.ZodObject<S>>
            >,
          )}
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
}

export default MetaEditor;
