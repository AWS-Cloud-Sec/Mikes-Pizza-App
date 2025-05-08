import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { 
  trackPageView, 
  trackUserEngagement, 
  initializeTracking
} from '../app/utils/analytics';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isProd = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProd) return;

    // Initialize tracking for the session
    initializeTracking();

    // Track initial pageview
    window.gtag('config', 'G-B87G43NDYF', {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title
    });

    const handleRouteChange = (url) => {
      // Track page view for each route change
      window.gtag('config', 'G-B87G43NDYF', {
        page_path: url,
        page_location: window.location.origin + url,
        page_title: document.title
      });

      // Track detailed page view
      trackPageView(window.location.origin + url, document.title);
      
      // Track route change as a user engagement event
      trackUserEngagement('navigation', 'route_change', url);
    };

    // Track user activity
    const trackUserActivity = () => {
      trackUserEngagement('interaction', 'user_activity', 'page_interaction');
    };

    // Add event listeners for user activity
    document.addEventListener('click', trackUserActivity);
    document.addEventListener('scroll', trackUserActivity);
    document.addEventListener('keypress', trackUserActivity);

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      document.removeEventListener('click', trackUserActivity);
      document.removeEventListener('scroll', trackUserActivity);
      document.removeEventListener('keypress', trackUserActivity);
    };
  }, [router.events, isProd]);

  return <Component {...pageProps} />;
}

export default MyApp; 