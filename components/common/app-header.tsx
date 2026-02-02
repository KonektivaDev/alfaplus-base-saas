import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import ThemeToggle from "./theme-toggle";

export function AppHeader(
  { breadcrumbs }: { breadcrumbs: React.ReactNode }
) {
  return (
    <>
      <SidebarTrigger />
      <Separator className="mr-2 h-full" orientation="vertical" />
      <div className="min-w-0 flex-1 overflow-hidden">{breadcrumbs}</div>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </>
  )
}