"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  )
}