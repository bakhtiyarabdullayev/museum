'use client';
import { MuseumMark } from './Logo';
import { useLanguage } from './LanguageProvider';
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <span>
        <MuseumMark />
        {t({
          az: 'Keçmişi qoruyuruq. Gələcəyə daşıyırıq.',
          en: 'Preserving the past. Inspiring the future.',
        })}
      </span>
      <span>
        {t({
          az: 'İnteraktiv muzey konsepti · Nümayiş versiyası',
          en: 'Interactive museum concept · Demo edition',
        })}
      </span>
      <span>© {new Date().getFullYear()} İRS</span>
    </footer>
  );
}
