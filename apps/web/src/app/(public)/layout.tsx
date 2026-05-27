// AppShell lives at the root level (providers.tsx).
// Public pages need no extra layout wrapper of their own.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
