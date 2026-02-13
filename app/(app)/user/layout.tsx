import { PageAside } from "@/components/common/page-aside";
import { SubPagesSelector } from "@/components/common/sub-pages-selector";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";

const subPages = [
  {
    title: "Profile",
    href: "/user/settings",
  },
  {
    title: "Account",
    href: "/user/account",
  },
];

export default function UserSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader size="sm">
        <PageHeaderContainer>
          <PageHeaderContent>
            <div className="space-y-1">
              <PageHeaderTitle>User Settings</PageHeaderTitle>
              <PageHeaderDescription>
                Manage your user settings
              </PageHeaderDescription>
            </div>
            <PageHeaderActions className="block md:hidden">
              <SubPagesSelector pages={subPages} />
            </PageHeaderActions>
          </PageHeaderContent>
        </PageHeaderContainer>
      </PageHeader>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row">
          <PageAside pages={subPages} />
          <main className="flex-1">
            <div className="container mx-auto px-0 py-4 md:py-6 md:pl-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
