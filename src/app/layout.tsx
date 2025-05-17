import type { Metadata } from 'next';
import { Lora, Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import DeviceGate from '@/components/device-gate'; // Import DeviceGate

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LuxeData Display',
  description: 'Elegantly displaying your important information.',
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
          'min-h-screen bg-background font-montserrat antialiased', // Changed primary font to montserrat
          lora.variable,
          playfairDisplay.variable,
          montserrat.variable // Added montserrat variable
        )}
      >
        <DeviceGate>{children}</DeviceGate> {/* Wrap children with DeviceGate */}
      </body>
    </html>
  );
}
