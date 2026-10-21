'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Box, Search, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExhibitCard from '@/components/ExhibitCard';
import ExhibitModal from '@/components/ExhibitModal';
import { useLanguage } from '@/components/LanguageProvider';
import { exhibits, categories, getExhibit } from '@/data/exhibits';
import { Category } from '@/data/types';
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false });
export default function CollectionPage() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [model, setModel] = useState(false);
  const [search, setSearch] = useState('');
  const list = exhibits.filter(
    (e) =>
      (filter === 'all' || e.category === filter) &&
      `${e.name[language]} ${e.period[language]} ${categories[e.category][language]}`
        .toLocaleLowerCase(language === 'az' ? 'az-AZ' : 'en-US')
        .includes(search.toLocaleLowerCase(language === 'az' ? 'az-AZ' : 'en-US')),
  );
  return (
    <>
      <Header />
      <main className="collection-main">
        <section className="collection-heading">
          <motion.div
            initial={{ opacity: 1, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="eyebrow">
              <span className="small-line" />
              {t({ az: 'ƏSRLƏRİN YADDAŞI', en: 'THE MEMORY OF CENTURIES' })}
            </div>
            <h1>
              {t({ az: 'Hər əşya,', en: 'Every object,' })}
              <br />
              <em>{t({ az: 'bir hekayə.', en: 'a story.' })}</em>
            </h1>
          </motion.div>
          <div className="collection-heading-right">
            <p>
              {t({
                az: 'İrsimizi yaşadan əşyalarla tanış olun. Onların hekayələrini dinləyin, detallarına yaxınlaşın və keçmişlə yeni bir bağ qurun.',
                en: 'Meet the objects that keep our heritage alive. Listen to their stories, explore their details, and find a new connection to the past.',
              })}
            </p>
            <Link href="/museum" className="text-link">
              {t({ az: 'Muzeydə kəşf et', en: 'Explore inside the museum' })}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <section aria-label={t({ az: 'Eksponatlar', en: 'Exhibits' })}>
          <div className="collection-toolbar">
            <div
              className="collection-filters"
              aria-label={t({ az: 'Kateqoriyalar', en: 'Categories' })}
            >
              <button
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'active' : ''}
                aria-pressed={filter === 'all'}
              >
                {t({ az: 'Hamısı', en: 'All exhibits' })}
                <small>{exhibits.length}</small>
              </button>
              {(Object.keys(categories) as Category[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={filter === category ? 'active' : ''}
                  aria-pressed={filter === category}
                >
                  {t(categories[category])}
                </button>
              ))}
            </div>
            <label className="collection-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t({ az: 'Kolleksiyada axtar…', en: 'Search the collection…' })}
                aria-label={t({ az: 'Eksponat axtar', en: 'Search exhibits' })}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label={t({ az: 'Axtarışı təmizlə', en: 'Clear search' })}
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
          <div className="collection-result-count">
            {list.length} {t({ az: 'eksponat', en: 'exhibits' })}
            <span>{t({ az: 'Nümayiş kolleksiyası', en: 'Demo collection' })}</span>
          </div>
          <motion.div className="collection-grid" layout>
            {list.map((exhibit) => (
              <motion.div
                key={exhibit.id}
                layout
                initial={{ opacity: 1, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExhibitCard
                  exhibit={exhibit}
                  index={exhibits.indexOf(exhibit)}
                  onClick={() => setSelected(exhibit.id)}
                />
              </motion.div>
            ))}
          </motion.div>
          {list.length === 0 && (
            <div className="empty-collection">
              <Search size={30} />
              <h2>{t({ az: 'Hələ bir hekayə tapılmadı', en: 'No stories found yet' })}</h2>
              <p>
                {t({
                  az: 'Başqa bir söz və ya kateqoriya ilə axtarın.',
                  en: 'Try a different search or category.',
                })}
              </p>
              <button
                className="button button-primary"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
              >
                {t({ az: 'Bütün eksponatları göstər', en: 'Show all exhibits' })}
              </button>
            </div>
          )}
        </section>
        <div className="collection-bottom-note">
          <Box size={18} />
          <span>
            {t({
              az: 'Əşyalara daha yaxından baxın. 3D işarəli eksponatları hər tərəfdən araşdırın.',
              en: 'Take a closer look. Explore artifacts with the 3D badge from every angle.',
            })}
          </span>
          <span>İRS</span>
        </div>
      </main>
      <Footer />
      <AnimatePresence>
        {selected && !model && (
          <ExhibitModal
            exhibit={getExhibit(selected)}
            onClose={() => setSelected(null)}
            onModel={() => setModel(true)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {model && selected && (
          <ModelViewer exhibit={getExhibit(selected)} onClose={() => setModel(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
