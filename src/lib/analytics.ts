import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

interface AnalyticsEvent {
  name: string;
  value: number;
  id: string;
  delta: number;
  url: string;
  userAgent: string;
}

// Function to send analytics data (replace with your preferred analytics service)
function sendToAnalytics(metric: Metric) {
  const analyticsEvent: AnalyticsEvent = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Option 1: Send to Google Analytics (if you use it)
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    });
  }

  // Option 2: Send to custom analytics endpoint
  if (import.meta.env.PROD) {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analyticsEvent),
      keepalive: true, // Ensure the request completes even if the page is closed
    }).catch(error => {
      console.error('Failed to send analytics:', error);
    });
  }

  // Option 3: Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: getVitalRating(metric.name, metric.value),
      ...analyticsEvent
    });
  }
}

// Get rating for web vitals (Good, Needs Improvement, Poor)
function getVitalRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Enhanced metric collection with additional context
function enhancedSendToAnalytics(metric: Metric) {
  // Add connection information if available
  const connection = (navigator as any).connection;
  const connectionInfo = connection ? {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
  } : {};

  const enhancedMetric = {
    ...metric,
    rating: getVitalRating(metric.name, metric.value),
    connection: connectionInfo,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    timestamp: Date.now(),
  };

  sendToAnalytics(enhancedMetric as any);
}

// Initialize performance monitoring
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  // Collect Web Vitals
  onCLS(enhancedSendToAnalytics);
  onINP(enhancedSendToAnalytics); // Interaction to Next Paint (replaced FID)
  onFCP(enhancedSendToAnalytics);
  onLCP(enhancedSendToAnalytics);
  onTTFB(enhancedSendToAnalytics);

  // Custom performance marks
  performance.mark('app-initialized');

  // Monitor route changes for SPA
  let currentPath = window.location.pathname;
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  function trackRouteChange() {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      performance.mark(`route-change-${newPath}`);
      
      // Measure route change performance
      const routeChangeTime = performance.now();
      sendToAnalytics({
        name: 'route-change',
        value: routeChangeTime,
        id: `route-${Date.now()}`,
        delta: routeChangeTime,
      } as any);

      currentPath = newPath;
    }
  }

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    trackRouteChange();
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    trackRouteChange();
  };

  window.addEventListener('popstate', trackRouteChange);
}

// Manual performance tracking utilities
export function trackEvent(eventName: string, value?: number) {
  sendToAnalytics({
    name: eventName,
    value: value || performance.now(),
    id: `event-${Date.now()}`,
    delta: value || 0,
  } as any);
}

export function startTiming(label: string) {
  performance.mark(`${label}-start`);
}

export function endTiming(label: string) {
  performance.mark(`${label}-end`);
  performance.measure(label, `${label}-start`, `${label}-end`);
  
  const measurement = performance.getEntriesByName(label, 'measure')[0];
  if (measurement) {
    sendToAnalytics({
      name: label,
      value: measurement.duration,
      id: `timing-${Date.now()}`,
      delta: measurement.duration,
    } as any);
  }
}

// Report largest contentful paint specifically
export function reportLCP() {
  onLCP((metric) => {
    console.log('Largest Contentful Paint:', metric);
    enhancedSendToAnalytics(metric);
  });
}
