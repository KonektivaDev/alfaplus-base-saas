import { LoadingSpinner } from "@/components/common/loading-spinner";
import { SignupForm } from "@/features/auth/forms/sign-up-form";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense fallback={<LoadingSpinner />} >
      <SignupForm />
    </Suspense>
  )
}