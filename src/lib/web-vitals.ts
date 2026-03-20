/**
 * Web Vitals Utility for measuring Core Web Vitals
 * 
 * This file provides functions for monitoring and reporting Core Web Vitals:
 * - CLS (Cumulative Layout Shift)
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - FCP (First Contentful Paint)
 * - INP (Interaction to Next Paint)
 * 
 * All metrics can be sent to the application's analytics endpoint
 */

type WebVitalsMetric = {
  name: string;
  delta: number;
  id: string;
  value?: number;
  entries?: any[];
};

/**
 * Function to send Web Vitals data to analytics
 */
export function sendToAnalytics(metric: WebVitalsMetric) {
  // Construct the payload with page path and navigation type
  const body = JSON.stringify({
    name: metric.name,
    delta: metric.delta,
    value: metric.value,
    id: metric.id,
    page: window.location.pathname,
    navigationType: getNavigationType()
  });
  
  // Use navigator.sendBeacon when available for better reliability
  // especially during page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    // Fallback to fetch API with keepalive
    fetch('/api/vitals', {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Get navigation type from performance API if available
 */
function getNavigationType() {
  if (window.performance && window.performance.navigation) {
    return window.performance.navigation.type;
  }
  return 0; // Default to navigation type 0 (direct navigation)
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  try {
    let prevCLS = 0;
    let prevLCP = 0;
    let prevFID = 0;
    let prevINP = 0;
    let prevFCP = 0;
    
    // Monitor CLS
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          const currentCLS = (entry as any).value;
          if (currentCLS > prevCLS) {
            prevCLS = currentCLS;
            sendToAnalytics({
              name: 'CLS',
              delta: currentCLS,
              id: (entry as any).id || generateUniqueID()
            });
          }
        }
      });
    }).observe({type: 'layout-shift', buffered: true} as any);
    
    // Monitor LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const currentLCP = (entry as any).startTime;
        if (currentLCP > prevLCP) {
          prevLCP = currentLCP;
          sendToAnalytics({
            name: 'LCP',
            delta: currentLCP,
            id: (entry as any).id || generateUniqueID()
          });
        }
      });
    }).observe({type: 'largest-contentful-paint', buffered: true} as any);
    
    // Monitor FID
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const currentFID = (entry as any).processingStart - (entry as any).startTime;
        if (currentFID > prevFID) {
          prevFID = currentFID;
          sendToAnalytics({
            name: 'FID',
            delta: currentFID,
            id: (entry as any).id || generateUniqueID()
          });
        }
      });
    }).observe({type: 'first-input', buffered: true} as any);
    
    // Monitor FCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const currentFCP = (entry as any).startTime;
        if (currentFCP > prevFCP) {
          prevFCP = currentFCP;
          sendToAnalytics({
            name: 'FCP',
            delta: currentFCP,
            id: (entry as any).id || generateUniqueID()
          });
        }
      });
    }).observe({type: 'first-contentful-paint', buffered: true} as any);
    
    // Monitor INP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if ((entry as any).interactionId) {
          const currentINP = (entry as any).duration;
          if (currentINP > prevINP) {
            prevINP = currentINP;
            sendToAnalytics({
              name: 'INP',
              delta: currentINP,
              id: (entry as any).interactionId || generateUniqueID()
            });
          }
        }
      });
    }).observe({type: 'event', durationThreshold: 16, buffered: true} as any);
    
  } catch (e) {
    console.error('Error initializing Web Vitals:', e);
  }
}

/**
 * Generate a pseudo-unique ID when needed
 */
function generateUniqueID() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
} 