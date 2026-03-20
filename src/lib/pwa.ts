/**
 * Progressive Web App utilities
 * 
 * This module provides functions for handling Progressive Web App features
 * including service worker registration and installation prompt handling.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/**
 * Register the service worker for PWA functionality
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  }
  return null;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Setup the install prompt listener
 * This can be called in a client-side component to prepare for PWA installation
 */
export function setupInstallPrompt(callback?: (event: BeforeInstallPromptEvent) => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Store the event for later use
      deferredPrompt = e as BeforeInstallPromptEvent;
      
      // Optional callback to inform the application that the app can be installed
      if (callback) {
        callback(deferredPrompt);
      }
    });
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      // Clear the deferredPrompt variable
      deferredPrompt = null;
    });
  }
}

/**
 * Show the install prompt to the user
 * Returns the user's choice (accepted or dismissed)
 */
export async function showInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) {
    return 'unavailable';
  }
  
  // Show the prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const choiceResult = await deferredPrompt.userChoice;
  
  // Clear the deferredPrompt for next time
  deferredPrompt = null;
  
  return choiceResult.outcome;
}

/**
 * Check if the app is already installed
 */
export function isAppInstalled(): boolean {
  if (typeof window !== 'undefined') {
    // Check if in standalone mode (PWA installed)
    return window.matchMedia('(display-mode: standalone)').matches || 
           (navigator as any).standalone === true;
  }
  return false;
}

/**
 * Check if the app can be installed
 */
export function canInstallApp(): boolean {
  return !!deferredPrompt;
} 