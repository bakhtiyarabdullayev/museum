'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Viewer } from '@photo-sphere-viewer/core';
import type { MarkersPlugin, MarkerConfig } from '@photo-sphere-viewer/markers-plugin';
import { Room, Language } from '@/data/types';
import { getExhibit } from '@/data/exhibits';
import { getRoom } from '@/data/rooms';
import { MuseumMark } from './Logo';
export type MuseumViewerHandle = {
  zoom: (amount: number) => void;
  reset: () => void;
  rotate: (amount: number) => void;
};
type Props = {
  room: Room;
  language: Language;
  focusedExhibit?: string;
  onExhibit: (id: string) => void;
  onRoom: (id: string) => void;
  onLoading: (loading: boolean) => void;
};
const arrow =
  '<svg width="42" height="38" viewBox="0 0 40 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 21 11-9 11 9"/><path d="m9 31 11-9 11 9"/></svg>';
function markersFor(room: Room, language: Language): MarkerConfig[] {
  return [
    ...room.hotspots.map(({ exhibitId, yaw, pitch }, index) => ({
      id: exhibitId,
      position: { yaw, pitch },
      size: { width: 44, height: 44 },
      anchor: 'center center',
      html: `<button class="exhibit-hotspot" aria-label="${getExhibit(exhibitId).name[language]}${getExhibit(exhibitId).model3D ? ' · 3D' : ''}" data-testid="hotspot-${exhibitId}"><span class="hotspot-core">${String(index + 1).padStart(2, '0')}</span>${getExhibit(exhibitId).model3D ? '<span class="hotspot-3d">3D</span>' : ''}<span class="hotspot-label">${getExhibit(exhibitId).name[language]}</span></button>`,
      data: { kind: 'exhibit', id: exhibitId },
    })),
    ...room.links.map(({ roomId, yaw, pitch }) => ({
      id: `room-${roomId}`,
      position: { yaw, pitch },
      size: { width: 100, height: 90 },
      anchor: 'center center',
      html: `<button class="room-hotspot" aria-label="${language === 'az' ? 'Keçid:' : 'Go to:'} ${getRoom(roomId).name[language]}" data-testid="room-${roomId}"><span>${arrow}</span><strong>${getRoom(roomId).name[language]}</strong></button>`,
      data: { kind: 'room', id: roomId },
    })),
  ];
}
const MuseumViewer = forwardRef<MuseumViewerHandle, Props>(function MuseumViewer(props, ref) {
  const container = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const markers = useRef<MarkersPlugin | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const currentPanorama = useRef('');
  useImperativeHandle(
    ref,
    () => ({
      zoom: (amount) => {
        const v = viewer.current;
        if (v)
          v.animate({ zoom: Math.max(0, Math.min(100, v.getZoomLevel() + amount)), speed: 400 });
      },
      reset: () => {
        viewer.current?.animate({
          yaw: latest.current.room.initialYaw,
          pitch: latest.current.room.initialPitch,
          zoom: 35,
          speed: 600,
        });
      },
      rotate: (amount) => {
        const v = viewer.current;
        if (v) v.animate({ yaw: v.getPosition().yaw + amount, speed: 500 });
      },
    }),
    [],
  );
  useEffect(() => {
    let disposed = false;
    setError(false);
    setReady(false);
    latest.current.onLoading(true);
    async function initialize() {
      try {
        const [{ Viewer }, { MarkersPlugin }] = await Promise.all([
          import('@photo-sphere-viewer/core'),
          import('@photo-sphere-viewer/markers-plugin'),
        ]);
        if (disposed || !container.current) return;
        const initial = latest.current;
        const instance = new Viewer({
          container: container.current,
          panorama: initial.room.panorama,
          navbar: false,
          defaultYaw: initial.room.initialYaw,
          defaultPitch: initial.room.initialPitch,
          defaultZoomLvl: 35,
          minFov: 45,
          maxFov: 95,
          mousewheel: true,
          touchmoveTwoFingers: false,
          loadingTxt: '',
          loadingImg: '',
          moveSpeed: 1.1,
          fisheye: 0,
          plugins: [[MarkersPlugin, { markers: markersFor(initial.room, initial.language) }]],
        });
        viewer.current = instance;
        currentPanorama.current = initial.room.panorama;
        const plugin = instance.getPlugin<MarkersPlugin>(MarkersPlugin);
        markers.current = plugin;
        instance.addEventListener(
          'ready',
          () => {
            if (!disposed) {
              setReady(true);
              latest.current.onLoading(false);
            }
          },
          { once: true },
        );
        instance.addEventListener('panorama-error', () => {
          if (!disposed) {
            setError(true);
            latest.current.onLoading(false);
          }
        });
        plugin.addEventListener('select-marker', ({ marker }) => {
          const data = marker.data as { kind: string; id: string };
          if (data.kind === 'room') latest.current.onRoom(data.id);
          else latest.current.onExhibit(data.id);
        });
      } catch (error) {
        console.error('Panorama initialization failed:', error);
        if (!disposed) {
          setError(true);
          latest.current.onLoading(false);
        }
      }
    }
    initialize();
    return () => {
      disposed = true;
      viewer.current?.destroy();
      viewer.current = null;
      markers.current = null;
    };
  }, [retry]);
  useEffect(() => {
    if (!ready || !viewer.current || !markers.current) return;
    let cancelled = false;
    async function update() {
      const v = viewer.current!;
      const p = markers.current!;
      if (currentPanorama.current !== props.room.panorama) {
        props.onLoading(true);
        p.clearMarkers();
        try {
          const completed = await v.setPanorama(props.room.panorama, {
            transition: { speed: 750 },
            position: { yaw: props.room.initialYaw, pitch: props.room.initialPitch },
            zoom: 35,
          });
          if (cancelled || !completed) return;
          currentPanorama.current = props.room.panorama;
        } catch (e) {
          console.error('Room loading failed:', e);
          if (!cancelled) setError(true);
        }
        if (!cancelled) props.onLoading(false);
      }
      if (cancelled) return;
      p.setMarkers(markersFor(props.room, props.language));
      if (props.focusedExhibit) {
        const spot = props.room.hotspots.find((spot) => spot.exhibitId === props.focusedExhibit);
        if (spot) v.animate({ yaw: spot.yaw, pitch: spot.pitch, zoom: 40, speed: 650 });
      }
    }
    update();
    return () => {
      cancelled = true;
    };
  }, [ready, props.room, props.language, props.focusedExhibit]);
  return (
    <div className="panorama-shell">
      <div ref={container} className="panorama-canvas" data-testid="panorama-viewer" />
      {!ready && !error && (
        <div className="panorama-loading">
          <MuseumMark />
          <span>
            {props.language === 'az' ? 'Muzeyin qapıları açılır…' : 'The museum doors are opening…'}
          </span>
        </div>
      )}
      {error && (
        <div className="panorama-loading">
          <p>
            {props.language === 'az'
              ? 'Panorama yüklənmədi. Yenidən cəhd edin.'
              : 'The panorama could not load. Please try again.'}
          </p>
          <button className="button button-ivory" onClick={() => setRetry((v) => v + 1)}>
            {props.language === 'az' ? 'Yenidən yoxla' : 'Retry'}
          </button>
        </div>
      )}
    </div>
  );
});
export default MuseumViewer;
