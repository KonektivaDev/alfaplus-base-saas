"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function OnboardingFooter({ email }: { email: string }) {
  const router = useRouter();
  return (
    <p className="text-muted-foreground mt-6 flex items-center justify-center gap-2 text-center text-xs">
      Logged in as <span className="text-foreground font-medium">{email}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          authClient.signOut();
          router.push("/login");
        }}
      >
        <LogOutIcon className="size-4" />
      </Button>
    </p>
  );
}
