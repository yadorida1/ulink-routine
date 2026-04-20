import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ULink Routine',
  description: '루틴을 하면 식물이 자라요 🌱',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-bg">
        <div className="mobile-frame">
          {children}
        </div>
      </body>
    </html>
  );
}
