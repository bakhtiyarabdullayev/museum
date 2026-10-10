'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Headphones, Pause, X, ChevronRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Exhibit } from '@/data/types';
import { categories } from '@/data/exhibits';
import { useLanguage } from './LanguageProvider';
import { useModal } from './useModal';
type Props = {
  exhibit: Exhibit;
  onClose: () => void;
  onModel: () => void;
  variant?: 'drawer' | 'modal';
  guideStep?: number;
  onNext?: () => void;
};
export default function ExhibitModal({
  exhibit,
  onClose,
  onModel,
  variant = 'modal',
  guideStep,
  onNext,
}: Props) {
  const { language, t } = useLanguage();
  const ref = useModal(onClose);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    setExpanded(false);
    setPlaying(false);
    setAudioError(false);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [exhibit.id, language]);
  function toggleAudio() {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (!audioRef.current) {
      const audio = new Audio(`/audio/${exhibit.id}-${language}.mp3`);
      audio.onended = () => setPlaying(false);
      audio.onerror = () => {
        setPlaying(false);
        setAudioError(true);
      };
      audioRef.current = audio;
    }
    audioRef.current
      .play()
      .then(() => {
        setPlaying(true);
        setAudioError(false);
      })
      .catch(() => setAudioError(true));
  }
  return (
    <motion.div
      className={`modal-backdrop ${variant === 'drawer' ? 'drawer-backdrop' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exhibit-title"
        className={`exhibit-dialog ${variant}`}
        initial={variant === 'drawer' ? { x: 50, opacity: 0 } : { y: 25, scale: 0.98 }}
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        exit={variant === 'drawer' ? { x: 50, opacity: 0 } : { y: 15, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="exhibit-image">
          <img src={exhibit.image} alt={t(exhibit.name)} />
          <span className="exhibit-image-label">
            İRS · {t({ az: 'NÜMAYİŞ KOLLEKSİYASI', en: 'DEMO COLLECTION' })}
          </span>
          <button
            className="close-button"
            onClick={onClose}
            aria-label={t({ az: 'Bağla', en: 'Close' })}
          >
            <X size={20} />
          </button>
          {exhibit.model3D && (
            <span className="image-3d-badge">
              <Box size={14} />
              3D
            </span>
          )}
        </div>
        <div className="exhibit-content">
          {guideStep !== undefined && (
            <div className="guide-panel-title">
              <Headphones size={16} />
              <span>{t({ az: 'BƏLƏDÇİLİ TUR', en: 'GUIDED TOUR' })}</span>
              <b>{guideStep + 1} / 3</b>
            </div>
          )}
          <div className="eyebrow">
            {t(categories[exhibit.category])}
            <span className="meta-separator" />
            {t(exhibit.period)}
          </div>
          <h2 id="exhibit-title">{t(exhibit.name)}</h2>
          <p className="exhibit-description">{t(exhibit.description)}</p>
          <div className="artifact-meta">
            <span>
              {t({ az: 'DÖVR', en: 'PERIOD' })}
              <strong>{t(exhibit.period)}</strong>
            </span>
            <span>
              {t({ az: 'MATERİAL', en: 'MATERIAL' })}
              <strong>{t(exhibit.material)}</strong>
            </span>
          </div>
          {expanded && (
            <motion.div
              className="exhibit-story"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <h3>{t({ az: 'Bir əşyanın yaddaşı', en: 'An object’s memory' })}</h3>
              <p>{t(exhibit.story)}</p>
            </motion.div>
          )}
          <button
            className="detail-toggle text-link"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {t(
              expanded
                ? { az: 'Daha az göstər', en: 'Show less' }
                : { az: 'Ətraflı bax', en: 'Discover the story' },
            )}
            <ArrowRight size={15} className={expanded ? 'rotated-arrow' : ''} />
          </button>
          <div className="exhibit-actions">
            {exhibit.model3D && (
              <button className="button button-primary" onClick={onModel}>
                <Box size={17} />
                {t({ az: '3D-də bax', en: 'Explore in 3D' })}
                <ArrowUpRightIcon />
              </button>
            )}
            <button
              className={`audio-button ${playing ? 'is-playing' : ''}`}
              onClick={toggleAudio}
              aria-label={t(
                playing
                  ? { az: 'Audionu dayandır', en: 'Pause narration' }
                  : { az: 'Audio hekayəni dinlə', en: 'Listen to the story' },
              )}
            >
              {playing ? <Pause size={17} /> : <Headphones size={17} />}
              <span>
                {t(
                  playing
                    ? { az: 'Dayandır', en: 'Pause' }
                    : { az: 'Audio hekayə', en: 'Audio story' },
                )}
              </span>
              {playing && (
                <span className="audio-bars">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
          </div>
          {audioError && (
            <p className="audio-error" role="status">
              {t({
                az: 'Audio yüklənmədi. Yenidən cəhd edin.',
                en: 'Audio could not load. Please try again.',
              })}
            </p>
          )}
          {guideStep !== undefined && (
            <div className="guide-next">
              <span className="guide-dots">
                {[0, 1, 2].map((n) => (
                  <i key={n} className={n <= guideStep ? 'active' : ''} />
                ))}
              </span>
              <button onClick={onNext} className="button button-primary">
                {t(
                  guideStep === 2
                    ? { az: 'Turu tamamla', en: 'Finish tour' }
                    : { az: 'Növbəti eksponat', en: 'Next exhibit' },
                )}
                {guideStep === 2 ? <Check size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          )}
          <p className="demo-caption">
            {t({
              az: 'Vizual və tarixi məlumatlar təqdimat üçün hazırlanmış nümunələrdir.',
              en: 'Visuals and historical information are illustrative presentation content.',
            })}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
function ArrowUpRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
