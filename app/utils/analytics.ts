import axios from 'axios';

const measurementId = 'G-B87G43NDYF';
const apiSecret = process.env.NEXT_PUBLIC_GA4_API_SECRET;
const domain = 'googleanalytics.dz75xu0t4b888.amplifyapp.com';

// Function to get client ID from cookie or generate a new one if not found
const getClientId = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Get existing client ID from cookie
  const cookies = document.cookie.split(';');
  const gaCookie = cookies.find(cookie => cookie.trim().startsWith('_ga='));
  
  if (gaCookie) {
    // Extract client ID from _ga cookie
    const match = gaCookie.match(/GA1\.1\.\d+\.(\d+)/);
    if (match) return match[1];
  }
  
  // Generate new client ID if we can't find it
  const newClientId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  document.cookie = `_ga=GA1.1.${newClientId}; path=/; max-age=63072000; domain=${domain}`;
  return newClientId;
};

export const sendGA4Event = async (eventName: string, params: any) => {
  if (!apiSecret) {
    console.warn('GA4 API Secret not configured');
    return;
  }

  try {
    await axios.post(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        client_id: getClientId(),
        events: [{
          name: eventName,
          params: {
            ...params,
            engagement_time_msec: 100, // active user tracking
            session_id: Date.now().toString(), // session tracking
          }
        }]
      }
    );
  } catch (error) {
    console.error('Error sending GA4 event:', error);
  }
};

// Page view tracking with screen class and user type
export const trackPageView = (url: string, title: string) => {
  const isNewUser = !document.cookie.includes('_ga=');
  
  sendGA4Event('page_view', {
    page_location: url,
    page_title: title,
    page_path: new URL(url).pathname,
    user_type: isNewUser ? 'new' : 'returning',
    user_id: getClientId(),
    session_id: Date.now().toString(),
    engagement_time_msec: 100
  });
};

// Track payment events with user and transaction details
export const trackPayment = (transactionId: string, amount: number, currency: string, items: any[]) => {
  sendGA4Event('purchase', {
    transaction_id: transactionId,
    value: amount,
    currency: currency,
    items: items,
    user_id: getClientId(),
    payment_method: 'stripe', // detect payment method used
    session_id: Date.now().toString()
  });
};

// Track user engagement and activity
export const trackUserEngagement = (action: string, category: string, label?: string, value?: number) => {
  sendGA4Event('user_engagement', {
    action,
    category,
    label,
    value,
    user_id: getClientId(),
    session_id: Date.now().toString(),
    engagement_time_msec: 100
  });
};

// Track user location by country
export const trackUserLocation = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    const { country_name, country_code } = response.data;
    
    sendGA4Event('user_location', {
      country: country_name,
      country_code: country_code,
      user_id: getClientId(),
      session_id: Date.now().toString()
    });
  } catch (error) {
    console.error('Error tracking user location:', error);
  }
};

// Track specific events with detailed parameters
export const trackEvent = (eventName: string, params: any) => {
  sendGA4Event(eventName, {
    ...params,
    user_id: getClientId(),
    session_id: Date.now().toString(),
    engagement_time_msec: 100
  });
};

// Initialize tracking for a new session
export const initializeTracking = async () => {
  // Track initial page view
  trackPageView(window.location.href, document.title);
  
  // Track user location
  await trackUserLocation();
}; 