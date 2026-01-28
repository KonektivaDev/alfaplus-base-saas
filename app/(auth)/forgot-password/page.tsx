import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ForgotPasswordForm } from "@/features/auth/forms/forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />} >
      <ForgotPasswordForm />
    </Suspense>
  )
}
