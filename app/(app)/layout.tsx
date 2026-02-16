import { AppHeader } from "@/components/common/app-header";
import { AppSidebar } from "@/components/common/app-sidebar";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
  sidebar: React.ReactNode;
};

export default async function AppLayout(props: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppLayoutGuard {...props} />
    </Suspense>
  );
}

async function AppLayoutGuard({ children, breadcrumbs, sidebar }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) redirect("/login");

  const activeOrganizationId =
    session.session?.activeOrganizationId ?? session.user?.activeOrganizationId;
  if (activeOrganizationId == null) redirect("/onboarding");

  return (
    <div className="[--header-height:calc(--spacing(12))]">
      <SidebarProvider>
        <AppSidebar content={sidebar} />
        <SidebarInset>
          <header className="bg-background sticky top-0 z-50 flex w-full items-center rounded-t-xl border-b">
            <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
              <AppHeader breadcrumbs={breadcrumbs} />
            </div>
          </header>
          <div className="@container flex flex-1 flex-col gap-4 overflow-hidden">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
