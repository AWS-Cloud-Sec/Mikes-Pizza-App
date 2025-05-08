import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '../utils/analytics';

export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get the full URL including search params
    const url = window.location.href;
    const title = document.title;

    // Track the page view
    trackPageView(url, title);

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Page View Tracked:', {
        pathname,
        searchParams: searchParams.toString(),
        url,
        title
      });
    }
  }, [pathname, searchParams]); // Re-run when pathname or search params change
}; 