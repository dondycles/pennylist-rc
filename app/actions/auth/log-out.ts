"use server";
import { createClient } from "@/lib/supabase/server";

export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
};
