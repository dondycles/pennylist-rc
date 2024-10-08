"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LogInSchema, SignUpSchema, UUIDType } from "@/lib/types";
const changeListNameSchema = z.object({
  listname: z
    .string()
    .min(6, { message: "Listname must be at least 6 characters." }),
});
const changePasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export const changeListPassword = async (
  values: z.infer<typeof changePasswordSchema>,
  id: string,
) => {
  const supabase = createClient();
  const listId = (await supabase.auth.getUser()).data.user?.id;
  if (!listId || !id) return { error: "List id not found!" };
  if (listId !== id) return { error: "List id did not match!" };

  const { error } = await supabase.auth.updateUser({
    password: values.password,
  });
  if (error) return { error: error.message };

  const { error: dbError } = await supabase
    .from("lists")
    .update({
      last_pass_changed: new Date().toUTCString(),
    })
    .eq("id", listId);

  if (dbError) return { error: dbError.message };

  return { success: "Password changed" };
};

export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };

  redirect("/login");
};

export const deleteList = async (id: z.infer<typeof UUIDType>) => {
  const supabase = createClient(process.env.SUPABASE_SECRET);
  const listId = (await supabase.auth.getUser()).data.user?.id;
  if (!listId || !id) return { error: "List id not found!" };
  if (listId !== id) return { error: "List id did not match!" };

  const { error: dbError } = await supabase.from("lists").delete().eq("id", id);
  if (dbError) return { error: dbError.message };
  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) return { error: authError.message };
  await logout();
};

export const signup = async (data: z.infer<typeof SignUpSchema>) => {
  const supabase = createClient();
  const email = `${data.listname}@pennylist.com`;
  const password = data.password;

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError)
    return {
      authError: authError.message,
    };

  const { error: dbError } = await supabase
    .from("lists")
    .insert({ listname: data.listname });

  if (dbError) return { dbError: dbError.message };
};
export const login = async (data: z.infer<typeof LogInSchema>) => {
  const supabase = createClient();
  const list = `${data.listname}@pennylist.com`;
  const password = data.password;
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: list,
      password,
    });
  if (authError)
    return {
      authError: authError.message as string,
    };

  const { error: dbError } = await supabase
    .from("lists")
    .select("*")
    .eq("id", authData.user.id)
    .single();
  if (dbError) return { dbError: dbError.message as string };
};
export const changeListName = async (
  values: z.infer<typeof changeListNameSchema>,
  listId: string,
) => {
  const supabase = createClient();
  const { error: authError } = await supabase.auth.updateUser({
    email: values.listname + "@pennylist.com",
  });

  if (authError) return { error: authError?.message };

  const { error: dbError } = await supabase
    .from("lists")
    .update({
      listname: values.listname,
    })
    .eq("id", listId);
  if (dbError) return { error: dbError?.message };
  return { success: "List name changed!" };
};
export const getList = async () => {
  const supabase = createClient();
  const list = await supabase.from("lists").select("*").single();
  return list;
};
