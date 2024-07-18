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
import { login } from "@/app/_actions/auth";
import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useTheme } from "next-themes";
import { LogInSchema } from "@/lib/schemas";

export default function LoginForm() {
  const [captchaToken, setCaptchaToken] = useState<string>();
  const captcha = useRef<HCaptcha>(null);
  const { theme } = useTheme();
  const [loggingIn, setLoggingIn] = useState(false);
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      listname: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LogInSchema>) {
    try {
      setLoggingIn(true);
      const res = await login(values, captchaToken!);

      if (res?.authError) {
        setLoggingIn(false);
        return form.setError("password", {
          message: res?.authError,
        });
      }
      if (res?.dbError) {
        setLoggingIn(false);
        return form.setError("password", {
          message: res?.dbError,
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
        className="space-y-4 my-auto max-w-[256px] mx-auto w-full"
      >
        <Logo className="size-12 mx-auto" zoom={8} strokeWidth={24} />
        <p className="text-xl">
          Log in to <span className="font-black text-primary">pennylist.</span>{" "}
        </p>
        <FormField
          control={form.control}
          name="listname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Listname" {...field} />
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
      <div className="mx-auto">
        <HCaptcha
          ref={captcha}
          sitekey="faaacf4c-dea6-41ac-a842-6d460c2478de"
          onVerify={(token) => {
            setCaptchaToken(token);
          }}
          theme={theme}
        />
      </div>
    </Form>
  );
}
