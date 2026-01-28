import BrandHomeLink from "@/components/common/brand-home-link";
import ThemeToggle from "@/components/common/theme-toggle";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex gap-2 justify-between">
          <BrandHomeLink />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="items-center justify-center">
          <p className="text-center text-xs text-muted-foreground">
            &copy; 2026 Konektiva SC. All rights reserved.
          </p>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width={500}
          height={500}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

    </div>
  )
}