import Link from 'next/link';
export function MuseumMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 2 25.2 9.2 34 6l-1 9.4L40 20l-7 4.6L34 34l-8.8-3.2L20 38l-5.2-7.2L6 34l1-9.4L0 20l7-4.6L6 6l8.8 3.2L20 2Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="m20 9 11 11-11 11L9 20 20 9Z" stroke="currentColor" strokeWidth="1.25" />
      <path d="m20 14 6 6-6 6-6-6 6-6Z" fill="currentColor" />
    </svg>
  );
}
export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${dark ? 'brand-light' : ''}`}
      aria-label="İRS — Azərbaycan Virtual Muzeyi"
    >
      <MuseumMark />
      <span className="brand-name">
        İRS
        <span className="brand-caption">
          AZƏRBAYCAN
          <br />
          VİRTUAL MUZEYİ
        </span>
      </span>
    </Link>
  );
}
