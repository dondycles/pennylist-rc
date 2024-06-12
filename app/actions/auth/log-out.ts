"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error };

  redirect("/login");
};
