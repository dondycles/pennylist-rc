"use server";

import { createStreamableValue, readStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { createClient } from "@/lib/supabase/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(3, "3s"),
});

export async function continueConversation(
  messages: CoreMessage[],
  listname: string,
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

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages,
    presencePenalty: 1,
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
