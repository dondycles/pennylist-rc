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
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat({
  listname,
  moneys,
  close,
}: {
  listname: string;
  moneys: string;
  close: () => void;
}) {
  const [useLastStream, setUseLastStream] = useState(true);
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

  const generateGreeting = async () => {
    setUseLastStream(false);
    const newMessages: CoreMessage[] = [
      ...messages,
      {
        content:
          "Say hello to the owner of this list called: " +
          listname +
          ". Then, uplift the user's mood and remind to save money. Lastly, Analyze the progress of my money: " +
          moneys +
          ". Show data, and emojis, format the texts.  Make it very short, add emojis, and random motivational qoutes. Example: Hello to the owner of this list: (list name)..., something like that.",
        role: "system",
      },
    ];

    setMessages(newMessages);

    const { limiter, stream, text } = await continueConversation(
      newMessages,
      listname,
    );

    setLimits(limiter);

    for await (const content of readStreamableValue(stream)) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: content as string,
        },
      ]);
    }

    const finishedText = await text;

    await saveLastStream(finishedText as string);
    setUseLastStream(true);
  };

  const { refetch: regenarate, isLoading: isGenerating } = useQuery({
    queryKey: ["ai", listname],
    queryFn: async () => await generateGreeting(),
    enabled: !useLastStream,
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
        regenarate();
      }
      return data;
    },
    enabled: useLastStream,
  });

  const latestStream = messages.toReversed()[0];
  const lastStream = last?.data?.last_ai_stream;

  return (
    <div className="space-y-2">
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
      <div className="flex ml-auto mr-0 gap-2 text-muted-foreground text-sm justify-center">
        <Button
          disabled={isGenerating}
          variant={"ghost"}
          onClick={() => {
            regenarate();
          }}
        >
          Reload {!useLastStream && limits.remaining}
        </Button>
        <Button disabled={isGenerating} variant={"ghost"} onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
}
