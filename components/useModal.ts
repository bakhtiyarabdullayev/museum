'use client';
import { useEffect, useRef } from 'react';
const modalStack: symbol[] = [];
let originalOverflow = '';
export function useModal(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const id = Symbol('museum-modal');
    const previous = document.activeElement as HTMLElement | null;
    if (modalStack.length === 0) originalOverflow = document.body.style.overflow;
    modalStack.push(id);
    document.body.style.overflow = 'hidden';
    const getFocusable = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex="0"]',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
    const timer = setTimeout(() => getFocusable()[0]?.focus(), 80);
    const handle = (event: KeyboardEvent) => {
      if (modalStack[modalStack.length - 1] !== id) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key === 'Tab') {
        const items = getFocusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (!ref.current?.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handle);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handle);
      const index = modalStack.indexOf(id);
      if (index >= 0) modalStack.splice(index, 1);
      if (modalStack.length === 0) {
        document.body.style.overflow = originalOverflow;
        if (previous?.isConnected) previous.focus();
      }
    };
  }, []);
  return ref;
}
