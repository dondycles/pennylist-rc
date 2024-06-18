"use server";

import { createClient } from "@/utils/supabase/server";

export const changePassword = async (password: string, id: string) => {
  const supabase = createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId || !id) return { error: { message: "User id not found!" } };
  if (userId !== id) return { error: { message: "User id did not match!" } };

  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) return { error: error };

  const { error: dbError } = await supabase
    .from("users")
    .update({
      last_pass_changed: new Date().toUTCString(),
    })
    .eq("id", userId);

  if (dbError) return { error: dbError.message };

  return { success: "Password changed" };
};
