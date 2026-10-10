import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-ext-500.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-ext-400.css';
import '@fontsource/dm-sans/latin-ext-500.css';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageProvider';
import { assetPath } from '@/lib/assetPath';
export const metadata: Metadata = {
  title: { default: 'İRS — Azərbaycan Virtual Muzeyi', template: '%s · İRS Virtual Muzey' },
  description:
    'Azərbaycanın mədəni irsini 360° virtual gəzinti və interaktiv 3D eksponatlarla kəşf edin.',
  icons: { icon: assetPath('/icon.svg') },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" data-scroll-behavior="smooth">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
