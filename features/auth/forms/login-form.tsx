"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { FormInput, FormPasswordInput } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { GoogleOAuthButton } from "../components/google-oauth-button";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL") || "/dashboard";

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push(callbackURL);
    });
  }, [router, callbackURL]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  async function handleLogin(values: z.infer<typeof formSchema>) {
    await authClient.signIn.email(
      {
        ...values,
        callbackURL: callbackURL,
      },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            router.push(
              `/verify-email?${createQueryString("email", values.email)}`
            );
          }
          toast.error("Failed to login!", {
            description: error.error.message || "Failed to login",
          });
        },
        onSuccess: () => {
          toast.success("Logged in successfully");
          router.push(callbackURL);
        },
      }
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="login-form"
      onSubmit={form.handleSubmit(handleLogin)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="m@example.com"
          autoComplete="email"
        />

        <FieldContent>
          <FormPasswordInput
            control={form.control}
            name="password"
            label="Password"
            autoComplete="current-password"
          />
          <a
            href="/forgot-password"
            className="ml-auto text-xs mt-2 underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </FieldContent>

        <Field>
          <Button type="submit">Login</Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <GoogleOAuthButton label="Login with Google" />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}