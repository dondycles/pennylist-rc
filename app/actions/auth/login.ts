"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logInSchema } from "@/app/(auth)/login/form";
import { z } from "zod";
export const login = async (data: z.infer<typeof logInSchema>) => {
  const supabase = createClient();
  const email = `${data.email}@pennylist.com`;
  const password = data.password;
  const { data: authUser, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  if (authError) return { authError };

  const { error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.user.id)
    .single();
  if (dbError) return { dbError };

  redirect("/list");
};
