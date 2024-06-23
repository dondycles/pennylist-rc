"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logInSchema } from "@/app/(auth)/login/form";
import { z } from "zod";
export const login = async (data: z.infer<typeof logInSchema>) => {
  const supabase = createClient();
  const list = `${data.listname}@pennylist.com`;
  const password = data.password;
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: list,
      password,
    });
  if (authError) return { authError: authError.message };

  const { error: dbError } = await supabase
    .from("lists")
    .select("*")
    .eq("id", authData.user.id)
    .single();
  if (dbError) return { dbError: dbError.message };

  redirect("/list");
};
