import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ResetPasswordForm } from "@/features/auth/forms/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />} >
      <ResetPasswordForm />
    </Suspense>
  )
}
