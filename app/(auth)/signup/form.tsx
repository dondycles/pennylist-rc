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
import { AlertCircle } from "lucide-react";
export const signUpSchema = z
  .object({
    listname: z
      .string()
      .min(6, { message: "Listname must be at least 6 characters." }),
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
      listname: "",
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
          Sign up to <span className="font-black text-primary">pennylist.</span>{" "}
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
        <div className="text-xs text-muted-foreground flex items-start gap-1">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <p>Make your listname unrelated to you for your extra privacy.</p>
        </div>
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
        <p className="text-xs text-muted-foreground">
          By signing up, I agree to pennylist&apos;s Terms and Conditions &
          Privacy Policy.
        </p>
      </form>
    </Form>
  );
}
