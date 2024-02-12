import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from './providers/ToastProvider';

export const metadata: Metadata = {
  title: 'Newsweek challenge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
