"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logInSchema } from "../(auth)/login/form";
import { signUpSchema } from "../(auth)/signup/form";
import { z } from "zod";

export const changeListPassword = async (password: string, id: string) => {
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
export const deleteList = async (id: string) => {
  const supabase = createClient(process.env.SUPABASE_SECRET);
  const { error: dbError } = await supabase.from("lists").delete().eq("id", id);
  if (dbError) return { error: dbError.message };
  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) return { error: authError.message };

  redirect("/login");
};
export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };

  redirect("/login");
};
export const signup = async (
  data: z.infer<typeof signUpSchema>,
  captchaToken: string,
) => {
  const supabase = createClient();
  const email = `${data.listname}@pennylist.com`;
  const password = data.password;

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { captchaToken },
  });
  if (authError)
    return {
      authError:
        authError.status === 422
          ? "Unfortunately, the chosen listname is already taken."
          : authError.message,
    };

  const { error: dbError } = await supabase
    .from("lists")
    .insert({ listname: data.listname });

  if (dbError) return { dbError: dbError.message };
};
export const login = async (
  data: z.infer<typeof logInSchema>,
  captchaToken: string,
) => {
  const supabase = createClient();
  const list = `${data.listname}@pennylist.com`;
  const password = data.password;
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: list,
      password,
      options: { captchaToken },
    });
  if (authError)
    return {
      authError:
        authError.status === 400
          ? "Invalid list credentials"
          : authError.message,
    };

  const { error: dbError } = await supabase
    .from("lists")
    .select("*")
    .eq("id", authData.user.id)
    .single();
  if (dbError) return { dbError: dbError.message };
};
export const changeListName = async (listname: string) => {
  const supabase = createClient();
  const { error: authError } = await supabase.auth.updateUser({
    email: listname + "@pennylist.com",
  });

  if (authError) return { error: authError?.message };

  const { error: dbError } = await supabase.from("lists").update({
    listname,
  });
  if (dbError) return { error: dbError?.message };
  return { success: "List name changed!" };
};
export const getList = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("lists").select("*").single();
  if (error) return { error: error.message };
  return { list: data };
};
