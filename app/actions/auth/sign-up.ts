"use server";
import { signUpSchema } from "@/app/(auth)/signup/form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
export const signup = async (data: z.infer<typeof signUpSchema>) => {
  const supabase = createClient();
  const email = `${data.listname}@pennylist.com`;
  const password = data.password;

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) return { authError: authError.message };

  const { error: dbError } = await supabase
    .from("lists")
    .insert({ listname: data.listname });

  if (dbError) return { dbError: dbError.message };

  redirect("/list");
};
