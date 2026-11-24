import './globals.css';
import Toaster from '@/components/Toaster';

export const metadata = {
  title: { default: 'Sushi Photography — Lucky Titity | Lagos, Nigeria', template: '%s · Sushi Photography' },
  description: 'Wedding, portrait and event photography in Lagos, Nigeria. Book a session with Lucky Titity.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400&display=swap"
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
