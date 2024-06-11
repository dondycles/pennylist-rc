"use server";
import { signUpSchema } from "@/app/(auth)/signup/form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
export const signup = async (data: z.infer<typeof signUpSchema>) => {
  const supabase = createClient();
  const email = `${data.email}@pennylist.com`;
  const password = data.password;

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) return { authError };

  const { error: dbError } = await supabase
    .from("users")
    .insert({ username: data.email });

  if (dbError) return { dbError };

  redirect("/list");
};
