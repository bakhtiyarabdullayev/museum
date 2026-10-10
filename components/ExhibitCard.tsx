'use client';
import { ArrowUpRight, Box } from 'lucide-react';
import { Exhibit } from '@/data/types';
import { categories } from '@/data/exhibits';
import { useLanguage } from './LanguageProvider';
export default function ExhibitCard({
  exhibit,
  index,
  onClick,
}: {
  exhibit: Exhibit;
  index: number;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  return (
    <button className="exhibit-card" onClick={onClick}>
      <div className="card-image">
        <img src={exhibit.image} alt={t(exhibit.name)} loading={index < 3 ? 'eager' : 'lazy'} />
        <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
        {exhibit.model3D && (
          <span className="card-3d">
            <Box size={13} />
            3D
          </span>
        )}
        <span className="card-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="card-meta">
        <span>{t(categories[exhibit.category])}</span>
        <span>{t(exhibit.period)}</span>
      </div>
      <h2>{t(exhibit.name)}</h2>
    </button>
  );
}
