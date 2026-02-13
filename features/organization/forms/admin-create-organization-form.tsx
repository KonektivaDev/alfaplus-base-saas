"use client";

import {
  FormCombobox,
  FormInput,
  FormSelectOption,
} from "@/components/common/form";
import { UserInfo } from "@/components/common/user-info";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithRole } from "better-auth/plugins";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  ownerId: z.string().min(1, { message: "Owner is required" }),
});

export function AdminCreateOrganizationForm({
  className,
  onOpenChange,
  ...props
}: React.ComponentProps<"form"> & {
  onOpenChange: (open: boolean) => void;
}) {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      await authClient.admin.listUsers(
        {
          query: {
            sortBy: "name",
            sortDirection: "asc",
          },
        },
        {
          onSuccess: ({ data }) => {
            setUsers(data.users);
          },
          onError: (error) => {
            toast.error("Error fetching users", {
              description: error.error.message || "Failed to fetch users",
            });
          },
        },
      );
    };
    fetchUsers();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ownerId: "",
    },
  });

  async function handleCreateOrganization(data: z.infer<typeof formSchema>) {
    const slug = data.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");
    const res = await authClient.organization.create({
      name: data.name,
      slug,
    });

    if (res.error) {
      toast.error("Error creating organization", {
        description: res.error.message || "Failed to create organization",
      });
      return;
    }
    try {
      form.reset();
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Error setting active organization", {
        description: "Failed to finish organization setup",
      });
    }
  }

  const ownerOptions: FormSelectOption[] = users.map((user) => ({
    value: user.id,
    label: user.name?.trim() || user.email || user.id,
  }));

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="create-organization-form"
      onSubmit={form.handleSubmit(handleCreateOrganization)}
    >
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Name"
          autoComplete="organization-name"
        />

        <FormCombobox
          control={form.control}
          name="ownerId"
          label="Owner"
          placeholder="Select owner"
          options={ownerOptions.map((option) => ({
            value: option.value,
            label: option.label as string,
          }))}
          renderOption={(option) => {
            const user = users.find((u) => u.id === option.value);
            return (
              <UserInfo
                name={user?.name ?? ""}
                email={user?.email ?? ""}
                image={user?.image ?? ""}
              />
            );
          }}
        />
      </FieldGroup>

      <Field>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Create
            </LoadingSwap>
          </Button>
        </DialogFooter>
      </Field>
    </form>
  );
}
