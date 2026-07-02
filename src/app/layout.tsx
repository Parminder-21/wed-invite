import type { Metadata } from 'next';
import { Cinzel_Decorative, Outfit } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel_Decorative({
  variable: '--font-cinzel',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wedding Invitation',
  description: 'You are cordially invited to celebrate our wedding.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}
