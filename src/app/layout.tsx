
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import DeviceGate from '@/components/device-gate';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GNA Complaints Viewer',
  description: 'View and manage GNA complaints.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-poppins antialiased',
          poppins.variable
        )}
      >
        <DeviceGate>{children}</DeviceGate>
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
