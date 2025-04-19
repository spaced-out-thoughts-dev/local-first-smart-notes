/**
 * Platform detection utilities
 */

export type Platform = 'electron' | 'capacitor' | 'web';

/**
 * Detect the current platform
 * @param platform - Platform to check
 * @returns boolean indicating if the app is running on the specified platform
 */
export function isPlatform(platform: Platform): boolean {
  // Check for Electron
  if (platform === 'electron') {
    return window.navigator.userAgent.includes('Electron');
  }
  
  // Check for Capacitor (iOS/Android)
  if (platform === 'capacitor') {
    return typeof (window as any).Capacitor !== 'undefined';
  }
  
  // Default to web platform
  if (platform === 'web') {
    return !isPlatform('electron') && !isPlatform('capacitor');
  }
  
  return false;
}

/**
 * Get the current platform
 * @returns The detected platform
 */
export function getCurrentPlatform(): Platform {
  if (isPlatform('electron')) return 'electron';
  if (isPlatform('capacitor')) return 'capacitor';
  return 'web';
}