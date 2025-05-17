
'use client';

// Simplified DeviceGate: Removed device detection for faster loading.
// The app is designed mobile-first but accessible on all devices.
export default function DeviceGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
