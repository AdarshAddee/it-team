import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Import Poppins
import './globals.css';
import { cn } from '@/lib/utils';
import DeviceGate from '@/components/device-gate';

// Configure Poppins font with desired weights
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'], // Light, Regular, Medium, SemiBold, Bold
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GNA Complaints Viewer', // Updated title
  description: 'View and manage GNA complaints.', // Updated description
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
          'min-h-screen bg-background font-poppins antialiased', // Set Poppins as the default font
          poppins.variable // Add Poppins variable
        )}
      >
        <DeviceGate>{children}</DeviceGate>
      </body>
    </html>
  );
}
