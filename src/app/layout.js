import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'Auth System',
  description: 'Authentication system with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main>{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}