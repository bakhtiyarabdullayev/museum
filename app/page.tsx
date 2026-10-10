'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
  Scan,
  View,
  Box,
  MousePointer2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MuseumMark } from '@/components/Logo';
import { useLanguage } from '@/components/LanguageProvider';
const fade = {
  initial: { opacity: 1, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};
export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <Header />
      <main className="landing-main">
        <section className="hero">
          <motion.div className="hero-copy" {...fade}>
            <div className="eyebrow">
              <span className="small-line" />
              {t({ az: 'İRSİMİZƏ YENİ BİR BAXIŞ', en: 'A NEW PERSPECTIVE ON HERITAGE' })}
            </div>
            <h1>
              {t({ az: 'Azərbaycanı', en: 'Discover' })}
              <br />
              <span>{t({ az: 'yenidən kəşf et.', en: 'Azerbaijan anew.' })}</span>
            </h1>
            <p className="hero-description">
              {t({
                az: 'Əsrlərin hekayələrinə bir addım yaxınlaşın. Azərbaycanın mədəni irsini istənilən yerdən interaktiv şəkildə kəşf edin.',
                en: 'Step closer to the stories of centuries. Explore Azerbaijan’s cultural heritage through an immersive experience, wherever you are.',
              })}
            </p>
            <div className="hero-ctas">
              <Link href="/museum" className="button button-primary">
                {t({ az: 'Virtual muzeyə daxil ol', en: 'Enter the virtual museum' })}
                <ArrowUpRight size={18} />
              </Link>
              <Link href="/collection" className="text-link">
                {t({ az: 'Eksponatları kəşf et', en: 'Explore the collection' })}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-note">
              <span className="live-dot" />
              {t({
                az: 'Bir kliklə. Sərhədsiz. Hər kəs üçün.',
                en: 'One click. Without borders. For everyone.',
              })}
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 1, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <img
              src="/images/museum-hero.jpg"
              alt={t({
                az: 'İsti daş divarlar və tarixi eksponatlarla virtual muzeyin interyeri',
                en: 'A warm limestone museum interior with historical exhibits',
              })}
              fetchPriority="high"
            />
            <div className="hero-image-shade" />
            <div className="panorama-tag">
              <View size={15} />
              <span>360° {t({ az: 'İNTERAKTİV TƏCRÜBƏ', en: 'IMMERSIVE EXPERIENCE' })}</span>
            </div>
            <div className="hero-orbit" aria-hidden="true">
              <MuseumMark />
            </div>
            <Link href="/museum" className="image-tour-link">
              <span>
                <span className="image-tour-eyebrow">
                  {t({ az: 'QAPILAR HƏR ZAMAN AÇIQDIR', en: 'OUR DOORS ARE ALWAYS OPEN' })}
                </span>
                <strong>{t({ az: 'Tarixə addım atın', en: 'Step into history' })}</strong>
              </span>
              <span className="round-arrow">
                <ArrowUpRight size={23} />
              </span>
            </Link>
            <div className="image-caption">
              <span>01 — {t({ az: 'GİRİŞ ZALI', en: 'ENTRANCE HALL' })}</span>
              <span>İRS VIRTUAL MUSEUM</span>
            </div>
          </motion.div>
        </section>
        <section className="experience-section" id="experience">
          <div className="section-intro">
            <span className="eyebrow">
              {t({ az: 'MƏDƏNİYYƏTƏ TOXUNAN TEXNOLOGİYA', en: 'WHERE CULTURE MEETS TECHNOLOGY' })}
            </span>
            <p>{t({ az: 'Sadəcə baxmayın. İçində olun.', en: 'Don’t just see it. Be there.' })}</p>
          </div>
          <div className="feature-grid">
            {[
              {
                number: '01',
                icon: Scan,
                title: { az: 'Virtual gəzinti', en: 'A virtual journey' },
                desc: {
                  az: 'Muzeyin otaqlarında 360° hərəkət edin. Hər bucaqda yeni bir hekayə.',
                  en: 'Explore museum rooms in 360°. A new story around every corner.',
                },
              },
              {
                number: '02',
                icon: MousePointer2,
                title: { az: 'İnteraktiv eksponatlar', en: 'Stories within objects' },
                desc: {
                  az: 'Eksponatlara toxunaraq onların tarixçəsini və gizli hekayələrini öyrənin.',
                  en: 'Select an exhibit to uncover its history and the stories it holds.',
                },
              },
              {
                number: '03',
                icon: Box,
                title: { az: '3D təcrübə', en: 'A new dimension' },
                desc: {
                  az: 'Seçilmiş tarixi əşyaları hər tərəfdən, ən incə detalına qədər araşdırın.',
                  en: 'Rotate, zoom, and explore selected artifacts down to the finest detail.',
                },
              },
            ].map(({ number, icon: Icon, title, desc }) => (
              <div className="feature" key={number}>
                <div className="feature-top">
                  <span>{number}</span>
                  <Icon size={23} strokeWidth={1.25} />
                </div>
                <h2>{t(title)}</h2>
                <p>{t(desc)}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="collection-strip">
          <span className="strip-symbol">
            <MuseumMark />
          </span>
          <div>
            <span className="eyebrow">
              {t({ az: 'HƏR ƏŞYANIN BİR HEKAYƏSİ VAR', en: 'EVERY OBJECT HAS A STORY' })}
            </span>
            <h2>
              {t({
                az: 'Altı eksponat. Əsrlərin yaddaşı.',
                en: 'Six objects. Centuries of memory.',
              })}
            </h2>
          </div>
          <Link href="/collection" className="text-link">
            {t({ az: 'Kolleksiyaya bax', en: 'View the collection' })}
            <MoveUpRight size={18} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
