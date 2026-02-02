import { BreadCrumbsRenderer } from "@/components/common/bread-crumbs-renderer"


export default function UserAccountBreadcrumbs() {
  const breadcrumbs = [
    {
      label: "User Settings",
      href: "/user/settings",
      isCurrent: false,
    },
    {
      label: "Account",
      href: "/user/account",
      isCurrent: true,
    }
  ]

  return (
    <BreadCrumbsRenderer breadcrumbs={breadcrumbs} />
  )
}