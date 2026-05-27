import { Spinner } from '@/components/ui/Spinner'

/**
 * Next.js Suspense boundary for the (protected) route group.
 * Shown automatically while any protected page is loading after navigation.
 */
export default function ProtectedLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  )
}
