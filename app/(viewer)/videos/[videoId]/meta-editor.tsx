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
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  topic: z.string().optional(),
  title: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type MetaEditorProps = {
  onClose: () => void;
};

const MetaEditor = ({ onClose }: MetaEditorProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tags: "a|b",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col h-full"
      >
        <div className="space-y-8 flex-1 overflow-auto px-4 -mx-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Combobox
                    defaultValues={field.value ? [field.value] : []}
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Combobox
                    defaultValues={field.value?.split("|") ?? []}
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
            name="notes"
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
        <div className="flex gap-2.5 flex-col mt-3.5">
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
