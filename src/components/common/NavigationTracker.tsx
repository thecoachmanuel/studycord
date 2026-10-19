'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { recordNavVisit } from '@/lib/navigation';

function TrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams ? searchParams.toString() : '';
    const fullUrl = query ? `${pathname}?${query}` : pathname;
    recordNavVisit(fullUrl);
  }, [pathname, searchParams]);

  return null;
}

export function NavigationTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
