"use client";

import { type CoreMessage } from "ai";
import { useEffect, useState } from "react";
import { continueConversation, saveLastStream } from "@/app/actions/ai";
import { readStreamableValue } from "ai/rsc";
import { AnimatePresence, motion } from "framer-motion";
// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat({
  listname,
  moneys,
}: {
  listname: string;
  moneys: string;
}) {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
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
    saveLastStream(finishedText as string);
  };

  const greeting = messages.toReversed()[0];

  useEffect(() => {
    if (!mounted) return;
    generateGreeting();
  }, [mounted]);

  useEffect(() => {
    if (!mounted && !open) return;
    if (messages[0]?.content.length > 0) setOpen(true);
  }, [messages, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
          className="text-muted-foreground text-sm h-fit rounded-lg p-2 flex flex-col gap-2"
        >
          <p className="whitespace-pre-wrap">
            {greeting.role === "assistant"
              ? (greeting.content as string)
              : "Thinking..."}
          </p>
          <p>
            Remaining prompts: {limits.remaining} <br />
            Reset: {new Date(limits.reset!).toLocaleTimeString()}
          </p>
          <div className="flex ml-auto mr-0 gap-2">
            {/* <button
              className="opacity-50 text-xs"
              onClick={() => {
                generateGreeting(analyzePrompt);
              }}
            >
              analyze my money
            </button> */}
            <button
              className="opacity-50 text-xs"
              onClick={() => {
                generateGreeting();
              }}
            >
              re-analyze
            </button>
            {/* <button
              className="text-xs"
              onClick={() => {
                setOpen(false);
              }}
            >
              dismiss
            </button> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
