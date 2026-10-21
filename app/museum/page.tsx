'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Headphones,
  LogOut,
  Map,
  Maximize,
  Minimize,
  Minus,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  MousePointer2,
  Grid2X2,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { LanguageToggle, useLanguage } from '@/components/LanguageProvider';
import { rooms, getRoom } from '@/data/rooms';
import { getExhibit, guidedExhibits } from '@/data/exhibits';
import ExhibitModal from '@/components/ExhibitModal';
import MuseumMap from '@/components/MuseumMap';
import type { MuseumViewerHandle } from '@/components/MuseumViewer';
import { assetPath } from '@/lib/assetPath';
const MuseumViewer = dynamic(() => import('@/components/MuseumViewer'), { ssr: false });
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false });
export default function MuseumPage() {
  const { language, t } = useLanguage();
  const [roomId, setRoomId] = useState('entrance');
  const [selected, setSelected] = useState<string | null>(null);
  const [model, setModel] = useState(false);
  const [map, setMap] = useState(false);
  const [guideStep, setGuideStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [hint, setHint] = useState(true);
  const [completed, setCompleted] = useState(false);
  const viewer = useRef<MuseumViewerHandle>(null);
  const ambient = useRef<HTMLAudioElement | null>(null);
  const page = useRef<HTMLDivElement>(null);
  const room = getRoom(roomId);
  const roomIndex = rooms.findIndex((r) => r.id === roomId);
  useEffect(() => {
    const timer = setTimeout(() => setHint(false), 10500);
    const listen = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', listen);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('fullscreenchange', listen);
      ambient.current?.pause();
    };
  }, []);
  useEffect(() => {
    if (!completed) return;
    const timer = setTimeout(() => setCompleted(false), 4500);
    return () => clearTimeout(timer);
  }, [completed]);
  const handleLoading = useCallback((value: boolean) => setLoading(value), []);
  function moveTo(id: string) {
    setRoomId(id);
    setSelected(null);
    setModel(false);
    setGuideStep(null);
    setHint(false);
  }
  function showExhibit(id: string) {
    setSelected(id);
    setGuideStep(null);
    setHint(false);
  }
  function tourStep(step: number) {
    const exhibit = getExhibit(guidedExhibits[step]);
    setRoomId(exhibit.roomId);
    setSelected(exhibit.id);
    setGuideStep(step);
    setHint(false);
  }
  function nextStep() {
    if (guideStep === 2) {
      setGuideStep(null);
      setSelected(null);
      setCompleted(true);
    } else tourStep((guideStep ?? 0) + 1);
  }
  function toggleSound() {
    if (!ambient.current) {
      ambient.current = new Audio(assetPath('/audio/ambient.mp3'));
      ambient.current.loop = true;
      ambient.current.volume = 0.25;
    }
    if (sound) {
      ambient.current.pause();
      setSound(false);
    } else
      ambient.current
        .play()
        .then(() => setSound(true))
        .catch(() => setSound(false));
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await page.current?.requestFullscreen();
    } catch {
      setFullscreen(false);
    }
  }
  return (
    <div className="museum-page" ref={page}>
      <MuseumViewer
        ref={viewer}
        room={room}
        language={language}
        focusedExhibit={selected ?? undefined}
        onExhibit={showExhibit}
        onRoom={moveTo}
        onLoading={handleLoading}
      />
      <div className="museum-vignette" />
      <header className="museum-header">
        <Logo dark />
        <div className="museum-header-actions">
          <LanguageToggle dark />
          <span className="toolbar-divider" />
          <button
            className={`museum-icon ${sound ? 'selected' : ''}`}
            onClick={toggleSound}
            aria-label={t(
              sound
                ? { az: 'Səsi söndür', en: 'Mute ambient sound' }
                : { az: 'Səsi aç', en: 'Enable ambient sound' },
            )}
            title={t({ az: 'Muzeyin atmosferi', en: 'Museum ambience' })}
          >
            {sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <Link
            href="/"
            className="museum-icon"
            aria-label={t({ az: 'Muzeydən çıx', en: 'Exit museum' })}
          >
            <LogOut size={19} />
          </Link>
        </div>
      </header>
      <div className="museum-top-note">
        <span className="live-dot" />{' '}
        {t({ az: '360° FOTOQRAFİK MUZEY GƏZİNTİSİ', en: '360° PHOTOGRAPHIC MUSEUM TOUR' })}
      </div>
      <AnimatePresence>
        {hint && !loading && (
          <motion.div
            className="tour-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <MousePointer2 size={19} />
            <span>
              {t({ az: 'Ətrafa baxmaq üçün sürükləyin', en: 'Drag to look around' })}
              <small>
                {t({
                  az: 'İşarələrə toxunaraq hekayələri kəşf edin',
                  en: 'Select a hotspot to discover its story',
                })}
              </small>
            </span>
            <button
              onClick={() => setHint(false)}
              aria-label={t({ az: 'İpucunu bağla', en: 'Dismiss tip' })}
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="museum-side-controls">
        <button
          onClick={() => viewer.current?.zoom(10)}
          aria-label={t({ az: 'Yaxınlaşdır', en: 'Zoom in' })}
          disabled={loading}
        >
          <Plus size={19} />
        </button>
        <button
          onClick={() => viewer.current?.zoom(-10)}
          aria-label={t({ az: 'Uzaqlaşdır', en: 'Zoom out' })}
          disabled={loading}
        >
          <Minus size={19} />
        </button>
        <span />
        <button
          onClick={() => viewer.current?.reset()}
          aria-label={t({ az: 'Görünüşü sıfırla', en: 'Reset view' })}
          disabled={loading}
        >
          <RotateCcw size={17} />
        </button>
        <button
          onClick={toggleFullscreen}
          aria-label={t(
            fullscreen
              ? { az: 'Tam ekrandan çıx', en: 'Exit full screen' }
              : { az: 'Tam ekran', en: 'Full screen' },
          )}
        >
          {fullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
        </button>
      </div>
      <div className="museum-bottom">
        <div className="room-info">
          <span className="eyebrow">
            0{roomIndex + 1} / 03 <i /> {t({ az: 'MƏKAN', en: 'LOCATION' })}
          </span>
          <AnimatePresence mode="wait">
            <motion.h1
              key={roomId + language}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {t(room.name)}
            </motion.h1>
          </AnimatePresence>
          <p>{t(room.subtitle)}</p>
          <div
            className="room-exhibit-index"
            aria-label={t({ az: 'Bu zaldakı eksponatlar', en: 'Exhibits in this room' })}
          >
            {room.hotspots.map((spot, index) => (
              <button
                key={spot.exhibitId}
                onClick={() => showExhibit(spot.exhibitId)}
                disabled={loading}
                data-testid={`exhibit-index-${spot.exhibitId}`}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {t(getExhibit(spot.exhibitId).name)}
              </button>
            ))}
          </div>
        </div>
        <div className="room-navigation">
          <button
            disabled={roomIndex === 0 || loading}
            onClick={() => moveTo(rooms[roomIndex - 1].id)}
            aria-label={t({ az: 'Əvvəlki zal', en: 'Previous room' })}
          >
            <ChevronLeft size={17} />
          </button>
          <div className="room-navigation-dots">
            {rooms.map((r, i) => (
              <button
                key={r.id}
                className={r.id === roomId ? 'active' : ''}
                onClick={() => moveTo(r.id)}
                disabled={loading}
                aria-label={t(r.name)}
                aria-current={r.id === roomId ? 'step' : undefined}
              >
                <img src={r.preview} alt="" />
                <span />
                <small>0{i + 1}</small>
              </button>
            ))}
          </div>
          <button
            disabled={roomIndex === 2 || loading}
            onClick={() => moveTo(rooms[roomIndex + 1].id)}
            aria-label={t({ az: 'Növbəti zal', en: 'Next room' })}
          >
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="museum-bottom-actions">
          <button className="museum-secondary" onClick={() => setMap(true)}>
            <Map size={17} />
            <span>{t({ az: 'Xəritə', en: 'Map' })}</span>
          </button>
          <Link
            href="/collection"
            className="museum-secondary collection-control"
            aria-label={t({ az: 'Kolleksiyaya bax', en: 'View collection' })}
          >
            <Grid2X2 size={17} />
          </Link>
          <button
            className="museum-guide"
            onClick={() =>
              guideStep === null ? tourStep(0) : (setGuideStep(null), setSelected(null))
            }
          >
            <Headphones size={17} />
            {t(
              guideStep !== null
                ? { az: 'Turu dayandır', en: 'End tour' }
                : { az: 'Bələdçili tur', en: 'Guided tour' },
            )}
            {guideStep !== null && <span>{guideStep + 1}/3</span>}
          </button>
        </div>
      </div>
      <div className="museum-floor-line" />
      <a
        className="photo-credit"
        href="https://hallwylskamuseet.se/en/"
        target="_blank"
        rel="noreferrer"
      >
        {t({
          az: 'Demo interyerlər: Hallwyl Museum, Stockholm',
          en: 'Reference interiors: Hallwyl Museum, Stockholm',
        })}
      </a>
      {loading && (
        <div className="room-loading" role="status">
          <span className="loading-ring" />
          {t({ az: 'Zal hazırlanır…', en: 'Preparing the room…' })}
        </div>
      )}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="tour-completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Compass size={19} />
            <span>
              {t({
                az: 'Tur tamamlandı. Kəşfinizə davam edin.',
                en: 'Tour complete. Your exploration continues.',
              })}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selected && !model && (
          <ExhibitModal
            key={selected}
            exhibit={getExhibit(selected)}
            onClose={() => {
              setSelected(null);
              setGuideStep(null);
            }}
            onModel={() => setModel(true)}
            variant="drawer"
            guideStep={guideStep ?? undefined}
            onNext={nextStep}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {model && selected && (
          <ModelViewer exhibit={getExhibit(selected)} onClose={() => setModel(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {map && <MuseumMap roomId={roomId} onRoom={moveTo} onClose={() => setMap(false)} />}
      </AnimatePresence>
    </div>
  );
}
