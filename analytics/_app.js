import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isProd = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProd) return;

    // Send initial pageview to Google Analytics
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
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, isProd]);

  return <Component {...pageProps} />;
}

export default MyApp; 