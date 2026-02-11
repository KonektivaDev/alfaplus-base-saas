import { BreadCrumbsRenderer } from "@/components/common/bread-crumbs-renderer"


export default function AdminUsersBreadcrumbs() {
  const breadcrumbs = [
    {
      label: "Admin Dashboard",
      href: "/admin/users",
      isCurrent: false,
    },
    {
      label: "Users",
      href: "/admin/users",
      isCurrent: true,
    }
  ]

  return (
    <BreadCrumbsRenderer breadcrumbs={breadcrumbs} />
  )
}