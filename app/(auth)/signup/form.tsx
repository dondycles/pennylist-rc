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
import { signup } from "@/app/actions/auth/sign-up";
import { useState } from "react";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(6, { message: "Username must be at least 6 characters." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    cpassword: z.string().min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.cpassword, {
    path: ["cpassword"],
    message: "Password did not match.",
  });

export default function SignupForm() {
  const [signingUp, setSigningUp] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      cpassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      setSigningUp(true);
      const res = await signup(values);
      if (res.authError) {
        setSigningUp(false);
        return form.setError("cpassword", {
          message: res.authError,
        });
      }
      if (res.dbError) {
        setSigningUp(false);
        return form.setError("cpassword", {
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
          Sign up to <span className="font-black">pennylist.</span>{" "}
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
        <FormField
          control={form.control}
          name="cpassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={signingUp} type="submit" className="w-full">
          Sign up
        </Button>
        <Button asChild type="submit" className="w-full" variant={"link"}>
          <Link href={"/login"}>or Log in</Link>
        </Button>
      </form>
    </Form>
  );
}
