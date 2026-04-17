export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3">
        <nav>ASD Specials</nav>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
