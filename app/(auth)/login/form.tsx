"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import { login } from "@/app/actions/auth/login";
import { useState } from "react";

export const logInSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export default function LoginForm() {
  const [loggingIn, setLoggingIn] = useState(false);
  const form = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof logInSchema>) {
    try {
      setLoggingIn(true);
      const res = await login(values);
      if (res.authError) {
        setLoggingIn(false);
        return form.setError("password", {
          message: res.authError,
        });
      }
      if (res.dbError) {
        setLoggingIn(false);
        return form.setError("password", {
          message: res.dbError,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mb-auto max-w-[256px] mx-auto w-full"
      >
        <Logo className="size-12 mx-auto" zoom={8} strokeWidth={24} />
        <p className="text-xl">
          Log in to <span className="font-black">pennylist.</span>{" "}
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loggingIn} type="submit" className="w-full">
          Log in
        </Button>
        <Button asChild type="submit" className="w-full" variant={"link"}>
          <Link href={"/signup"}>or Sign up</Link>
        </Button>
      </form>
    </Form>
  );
}
