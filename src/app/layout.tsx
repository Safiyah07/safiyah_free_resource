import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MVP Scope Blueprint | The Smallest Version to Build in 2 Weeks',
  description:
    'Discover the smallest, smartest version of your product idea to build first—and exactly what to leave out. Based on proven qualification and scoping best practices.',
  openGraph: {
    title: 'MVP Scope Blueprint | Safiyah from webly',
    description: 'Find out what to build in version one and what to defer.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#08080A] text-white selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
