import { BreadCrumbsRenderer } from "@/components/common/bread-crumbs-renderer"


export default function UserSettingsBreadcrumbs() {

  const breadcrumbs = [
    {
      label: "User Settings",
      href: "/user/settings",
      isCurrent: false,
    },
    {
      label: "Profile",
      href: "/user/settings",
      isCurrent: true,
    }
  ]

  return (
    <BreadCrumbsRenderer breadcrumbs={breadcrumbs} />
  )
}