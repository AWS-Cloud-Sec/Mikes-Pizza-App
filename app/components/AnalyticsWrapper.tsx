'use client';

import { usePageTracking } from '../hooks/usePageTracking';

export default function AnalyticsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize page tracking
  usePageTracking();

  return <>{children}</>;
} 