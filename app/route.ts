import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "10s"),
});

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { limit, reset, remaining } = await ratelimit.limit(ip);
}
