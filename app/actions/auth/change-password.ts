"use server";

import { createClient } from "@/lib/supabase/server";

export const changePassword = async (password: string, id: string) => {
  const supabase = createClient();
  const listId = (await supabase.auth.getUser()).data.user?.id;
  if (!listId || !id) return { error: { message: "List id not found!" } };
  if (listId !== id) return { error: { message: "List id did not match!" } };

  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) return { error: error };

  const { error: dbError } = await supabase
    .from("lists")
    .update({
      last_pass_changed: new Date().toUTCString(),
    })
    .eq("id", listId);

  if (dbError) return { error: dbError.message };

  return { success: "Password changed" };
};
