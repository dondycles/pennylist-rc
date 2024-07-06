"use client";

import { type CoreMessage } from "ai";
import { useEffect, useState } from "react";
import {
  continueConversation,
  getLastStream,
  saveLastStream,
} from "@/app/actions/ai";
import { readStreamableValue } from "ai/rsc";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { BotMessageSquare } from "lucide-react";
import { useListState } from "@/store";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const askAiSchema = z.object({
  question: z.string().max(44, { message: "Max of 44 characters only." }),
});

export default function Chat({
  listname,
  diffs,
  close,
}: {
  listname: string;
  diffs: string;
  close: () => void;
}) {
  const listState = useListState();
  const [useLastStream, setUseLastStream] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [askAiMode, setAskAiMode] = useState(false);
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [limits, setLimits] = useState<{
    remaining: number | null;
    reset: number | null;
    limit: number | null;
  }>({
    remaining: null,
    reset: null,
    limit: null,
  });
  const { toast } = useToast();
  const form = useForm<z.infer<typeof askAiSchema>>({
    resolver: zodResolver(askAiSchema),
    defaultValues: {
      question: "",
    },
  });

  const generateAi = async (type: "analyze" | "input", input?: string) => {
    setUseLastStream(false);
    setIsAiGenerating(true);

    const { limiter, stream, text } = await continueConversation(
      messages,
      listname,
      diffs,
      type,
      input,
    );

    setLimits(limiter);

    if (limiter.remaining === 0) {
      setUseLastStream(true);
      setIsAiGenerating(false);
      return;
    }

    for await (const content of readStreamableValue(stream)) {
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: content as string,
        },
      ]);
    }

    const finishedText = await text;
    await saveLastStream(finishedText as string);
    setUseLastStream(true);
    setIsAiGenerating(false);
  };

  const { mutate: regenarate } = useMutation({
    mutationKey: ["ai", listname],
    mutationFn: async (type: "analyze" | "input") => {
      await generateAi(type);
      form.reset;
      return "";
    },
  });

  const {
    data: last,
    error: lastStreamError,
    isLoading: isLoadingLast,
  } = useQuery({
    queryKey: ["last-stream", listname],
    queryFn: async () => {
      const data = await getLastStream();
      if (!data.data?.last_ai_stream) {
        regenarate("analyze");
      }
      return data;
    },
    enabled: useLastStream && listState.showAIDialog,
  });

  const latestStream = messages.toReversed()[0];
  const lastStream = last?.data?.last_ai_stream;

  return (
    <Dialog
      open={listState.showAIDialog}
      onOpenChange={() => {
        if (isAiGenerating) {
          toast({
            title: "Uh oh!",
            description: "Please don't close while AI is generating.",
            variant: "destructive",
            duration: 3000,
          });
          return;
        }
        listState.setShowAIDialog();
      }}
    >
      <DialogContent className="p-2 gap-2 h-fit">
        <DialogHeader className="sr-only">
          <DialogTitle className="flex flex-row gap-1 items-center">
            Hi, I am Pendong! <BotMessageSquare />
          </DialogTitle>

          <DialogDescription>
            I am here to manage your richness.
          </DialogDescription>
        </DialogHeader>

        <Tabs className="flex flex-col gap-2" defaultValue="analyze">
          <TabsList className="w-fit mx-auto p-1 rounded-lg">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="ask">Ask</TabsTrigger>
          </TabsList>
          <ScrollArea className="max-h-[50dvh]">
            <AnimatePresence>
              <motion.div
                transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
                className="text-muted-foreground text-sm h-fit rounded-lg flex flex-col gap-2"
              >
                <p className="whitespace-pre-wrap">
                  {useLastStream
                    ? (lastStream as string)
                    : latestStream?.role === "assistant"
                      ? (latestStream.content as string)
                      : "Thinking..."}
                </p>
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
          <TabsContent value="ask" className="gap-2 flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  (values: z.infer<typeof askAiSchema>) =>
                    generateAi("input", values.question),
                )}
                className="flex flex-col gap-2 justify-center items-center"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full">
                      <FormControl>
                        <Input
                          placeholder="Ask Pendong about your wealth."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" text-muted-foreground ">
                  <Button
                    variant={"ghost"}
                    type="submit"
                    disabled={isAiGenerating}
                  >
                    Ask
                  </Button>
                  <Button
                    disabled={isAiGenerating}
                    variant={"ghost"}
                    onClick={close}
                  >
                    Close
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="analyze">
            <div className="flex gap-2 text-muted-foreground text-sm justify-center">
              <Button
                disabled={isAiGenerating}
                variant={"ghost"}
                onClick={() => {
                  regenarate("analyze");
                }}
              >
                Analyze {!useLastStream && `(${limits.remaining ?? 0})`}
              </Button>
              <Button
                disabled={isAiGenerating}
                variant={"ghost"}
                onClick={close}
              >
                Close
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
