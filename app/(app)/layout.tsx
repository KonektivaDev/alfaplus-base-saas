import { AppHeader } from "@/components/common/app-header";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children,
  breadcrumbs,
  sidebar,
}: {
  children: React.ReactNode,
  breadcrumbs: React.ReactNode,
  sidebar: React.ReactNode,
}) {
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
  )
}