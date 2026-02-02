"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />} >
      <SuspendedPage />
    </Suspense>
  )
}

function SuspendedPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  function startInterval() {
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;
        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  function startEmailVerificationCountdown(time = 30) {
    if (interval.current) {
      clearInterval(interval.current);
    }
    setTimeToNextResend(time);
    startInterval();
  }

  useEffect(() => {
    startInterval();

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <h1 className="text-2xl font-bold">Verify your email address</h1>
      <p className="text-muted-foreground text-sm text-balance">
        We have sent a verification link to your email address. Please check
        your mailbox and click the link to verify your account.
      </p>

      <BetterAuthActionButton
        variant="outline"
        type="button"
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
        action={() => {
          startEmailVerificationCountdown(30);
          return authClient.sendVerificationEmail({
            email: email as string,
            callbackURL: "/login",
          });
        }}
      >
        {timeToNextResend > 0
          ? `Resend in ${timeToNextResend}s`
          : "Resend verification email"}
      </BetterAuthActionButton>
    </div>
  );
}
