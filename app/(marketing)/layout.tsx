import MarketingHeader from "@/components/marketing/header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden scroll-smooth antialiased">
      <MarketingHeader />
      {children}
    </main>
  )
}