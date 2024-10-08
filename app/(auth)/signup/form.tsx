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
import { signup } from "@/app/_actions/auth";
import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
// import { useTheme } from "next-themes";
import { SignUpSchema } from "@/lib/types";

export default function SignupForm() {
  const [signingUp, setSigningUp] = useState(false);
  // const [captchaToken, setCaptchaToken] = useState<string>();
  const captcha = useRef<HCaptcha>(null);
  // const { theme } = useTheme();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      listname: "",
      password: "",
      cpassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    try {
      setSigningUp(true);
      const res = await signup(values);
      if (res?.authError) {
        setSigningUp(false);
        return form.setError("cpassword", {
          message: res.authError,
        });
      }
      if (res?.dbError) {
        setSigningUp(false);
        return form.setError("cpassword", {
          message: res?.dbError,
        });
      }
      captcha.current?.resetCaptcha();
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
        <p className="text-xs text-muted-foreground text-center">
          By signing up, I agree to pennylist&apos;s{" "}
          <Link href={"/privacypolicy"} className="underline">
            Privacy Policy
          </Link>{" "}
          &{" "}
          <Link href={"/termsandconditions"} className="underline">
            Terms and Conditions
          </Link>
          .
        </p>
      </form>
    </Form>
  );
}
