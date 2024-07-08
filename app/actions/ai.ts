"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { createClient } from "@/lib/supabase/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(3, "10s"),
});

export async function continueConversation(
  lastMessages: CoreMessage[],
  listname: string,
  diffs: string,
  type: "input" | "analyze",
  input?: string,
) {
  const { remaining, reset, limit } = await ratelimit.limit(
    listname ?? "no-list",
  );

  const limiter = {
    remaining,
    reset,
    limit,
  };
  if (remaining === 0)
    return { stream: createStreamableValue("Limit exceeded!").value, limiter };

  const messages: CoreMessage[] = [
    ...lastMessages,
    {
      content:
        (type === "analyze" &&
          "Say hello to the owner of this list called: " +
            listname +
            ". Then, uplift the user's mood and remind to save money. Lastly, Analyze the progress of my money: " +
            diffs +
            ". Show data, and emojis, format the texts.  Make it very short, add emojis, and random motivational qoutes. Example: Hello to the owner of this list: (list name)..., something like that.") ||
        (type === "input" && input) ||
        "Hello!",
      role: "system",
    },
  ];

  const result = await streamText({
    model: openai("gpt-4o-2024-05-13"),
    messages,
  });

  const stream = createStreamableValue(result.textStream);

  return { stream: stream.value, limiter, text: result.text };
}

export async function saveLastStream(text: string) {
  const supabase = createClient();
  const id = (await supabase.auth.getUser()).data.user?.id;
  await supabase
    .from("lists")
    .update({
      last_ai_stream: text,
    })
    .eq("id", id as string);
}

export async function getLastStream() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lists")
    .select("last_ai_stream")
    .single();
  if (error) return { error: error.message };
  return { data };
}
