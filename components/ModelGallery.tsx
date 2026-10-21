'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, Box, X } from 'lucide-react';
import { exhibits } from '@/data/exhibits';
import { useLanguage } from './LanguageProvider';
import { useModal } from './useModal';

export default function ModelGallery({
  onSelect,
  onClose,
}: {
  onSelect: (id: string) => void;
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
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-gallery-title"
        className="model-gallery"
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
      >
        <button
          className="close-button"
          onClick={onClose}
          aria-label={t({ az: '3D kolleksiyanı bağla', en: 'Close 3D collection' })}
        >
          <X size={20} />
        </button>
        <span className="eyebrow">
          <Box size={15} /> {t({ az: 'İNTERAKTİV KOLLEKSİYA', en: 'INTERACTIVE COLLECTION' })}
        </span>
        <h2 id="model-gallery-title">
          {t({ az: 'Tarixə hər tərəfdən baxın', en: 'A new perspective on history' })}
        </h2>
        <p>
          {t({
            az: 'Eksponat seçin. Fırladın, yaxınlaşdırın və ən incə detalları kəşf edin.',
            en: 'Choose an artifact. Rotate, zoom, and discover the smallest details.',
          })}
        </p>
        <div className="model-gallery-grid">
          {exhibits
            .filter((exhibit) => exhibit.model3D)
            .map((exhibit) => (
              <button
                key={exhibit.id}
                className="model-gallery-card"
                onClick={() => onSelect(exhibit.id)}
                data-testid={`model-choice-${exhibit.id}`}
              >
                <div className="model-gallery-image">
                  <img src={exhibit.image} alt={t(exhibit.name)} />
                  <span>
                    <Box size={13} /> 3D
                  </span>
                </div>
                <span className="model-gallery-period">{t(exhibit.period)}</span>
                <h3>{t(exhibit.name)}</h3>
                <span className="model-gallery-action">
                  {t({ az: '3D-də bax', en: 'Explore in 3D' })} <ArrowUpRight size={17} />
                </span>
              </button>
            ))}
        </div>
        <small className="model-gallery-note">
          {t({
            az: 'Rəqəmsal arxivdən 3D nümunələr',
            en: '3D reference studies from the digital archive',
          })}
        </small>
      </motion.div>
    </motion.div>
  );
}
