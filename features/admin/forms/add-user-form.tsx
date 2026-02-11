"use client";

import { FormInput, FormPasswordInput } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export function AddUserDialog({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleAddUser(data: z.infer<typeof formSchema>) {
    await authClient.admin.createUser(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        role: "user",
        // data: { customField: "customValue" },
      },
      {
        onError: (error) => {
          toast.error("Failed to add user", {
            description: error.error.message || "Failed to add user",
          });
        },
        onSuccess: async () => {
          form.reset();
          setOpen(false);
          const res = await authClient.sendVerificationEmail(
            {
              email: data.email,
              callbackURL: "/login",
            },
            {
              credentials: "omit",
            },
          );
          if (res.error) {
            toast.error("Failed to send verification email", {
              description: res.error.message,
            });
          } else {
            toast.success(
              "User added successfully. Verification email sent to the user.",
            );
            router.refresh();
          }
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset();
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline">
            <PlusIcon className="size-4" />
            Add User
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Add a new user to the system.</DialogDescription>
        </DialogHeader>
        <form
          className={cn("flex flex-col gap-6", className)}
          {...props}
          id="signup-form"
          onSubmit={form.handleSubmit(handleAddUser)}
        >
          <FieldGroup>
            <FormInput
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="John Doe"
              autoComplete="off"
            />

            <FormInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="m@example.com"
              autoComplete="off"
            />

            <FormPasswordInput
              control={form.control}
              name="password"
              label="Password"
              autoComplete="off"
            />

            <Field>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Add User
                </LoadingSwap>
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
