import { AdminNavigation } from "@/features/admin/components/admin-navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNavigation />
      {children}
    </div>
  )
}