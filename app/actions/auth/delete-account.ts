"use server";

import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";

export const deleteMyAccount = async (id: string) => {
  const supabase = createClient(process.env.SUPABASE_SECRET);
  const { error: dbError } = await supabase.from("users").delete().eq("id", id);
  if (dbError) return { error: dbError.message };
  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) return { error: authError.message };

  redirect("/login");
};
