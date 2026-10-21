'use client';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, Map, X } from 'lucide-react';
import { rooms } from '@/data/rooms';
import { useLanguage } from './LanguageProvider';
import { useModal } from './useModal';
export default function MuseumMap({
  roomId,
  onRoom,
  onClose,
}: {
  roomId: string;
  onRoom: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const ref = useModal(onClose);
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={ref}
        className="map-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
        initial={{ y: 20, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
      >
        <button
          className="close-button"
          onClick={onClose}
          aria-label={t({ az: 'Xəritəni bağla', en: 'Close map' })}
        >
          <X size={20} />
        </button>
        <span className="eyebrow">
          <Map size={15} />
          {t({ az: 'SƏYAHƏTİNİZİN XƏRİTƏSİ', en: 'YOUR JOURNEY AT A GLANCE' })}
        </span>
        <h2 id="map-title">{t({ az: 'Muzeyi kəşf edin', en: 'Find your next story' })}</h2>
        <p>
          {t({
            az: 'Bir zal seçin və səyahətinizi davam etdirin.',
            en: 'Choose a room and continue your journey.',
          })}
        </p>
        <div className="floor-plan">
          {rooms.map((room, i) => (
            <div key={room.id}>
              <button
                className={`floor-room ${roomId === room.id ? 'current' : ''}`}
                onClick={() => {
                  onRoom(room.id);
                  onClose();
                }}
              >
                <span className="floor-room-number">
                  <img src={room.preview} alt="" />
                  <b>0{i + 1}</b>
                </span>
                <span>
                  <strong>{t(room.name)}</strong>
                  <small>
                    {roomId === room.id
                      ? t({ az: 'Hazırda buradasınız', en: 'You are here' })
                      : t(room.subtitle)}
                  </small>
                </span>
                {roomId === room.id ? <Check size={18} /> : <ArrowUpRight size={18} />}
              </button>
              {i < 2 && (
                <div className="floor-connector">
                  <span />
                  <ArrowDown size={15} />
                  <span />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="map-legend">
          <i />
          {t({ az: 'Hazırkı məkan', en: 'Current location' })}
          <span>
            {rooms.length} {t({ az: 'zal', en: 'rooms' })} ·{' '}
            {rooms.reduce((count, room) => count + room.hotspots.length, 0)}{' '}
            {t({ az: 'eksponat nöqtəsi', en: 'exhibit hotspots' })}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
