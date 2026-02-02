import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "../ui/sidebar";
import { NavUser } from "./nav-user";


export function AppSidebar({ content }: { content?: ReactNode }) {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="mt-0.5 h-(--header-height)">
        <SidebarMenu>
          {/* <SidebarOrganizationButton /> TODO: Add organization button */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{content}</SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <NavUser />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
