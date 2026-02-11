import BrandHomeLink from "@/components/common/brand-home-link";
import ThemeToggle from "@/components/common/theme-toggle";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex justify-between gap-2">
          <BrandHomeLink />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
