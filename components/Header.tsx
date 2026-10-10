'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { LanguageToggle, useLanguage } from './LanguageProvider';
export default function Header() {
  const { t } = useLanguage();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav
          className={open ? 'desktop-nav mobile-open' : 'desktop-nav'}
          aria-label={t({ az: 'Əsas menyu', en: 'Main navigation' })}
        >
          <Link
            className={path === '/museum' ? 'nav-active' : ''}
            href="/museum"
            onClick={() => setOpen(false)}
          >
            {t({ az: 'Virtual muzey', en: 'Virtual museum' })}
          </Link>
          <Link
            className={path === '/collection' ? 'nav-active' : ''}
            href="/collection"
            onClick={() => setOpen(false)}
          >
            {t({ az: 'Kolleksiya', en: 'Collection' })}
          </Link>
          <Link href="/#experience" onClick={() => setOpen(false)}>
            {t({ az: 'Təcrübə haqqında', en: 'The experience' })}
          </Link>
        </nav>
        <div className="header-actions">
          <LanguageToggle />
          <Link href="/museum" className="header-tour">
            {t({ az: 'Muzeyə daxil ol', en: 'Enter museum' })}
            <ArrowUpRight size={15} />
          </Link>
          <button
            className="mobile-menu icon-button"
            onClick={() => setOpen(!open)}
            aria-label={t({ az: 'Menyunu aç', en: 'Toggle menu' })}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
