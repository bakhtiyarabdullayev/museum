import { Room } from './types';
import { assetPath } from '@/lib/assetPath';
// Equirectangular, 2:1 images. Hotspot coordinates are in radians.
// Replace a panorama here, then adjust yaw/pitch to match the new exhibit positions.
export const rooms: Room[] = [
  {
    id: 'entrance',
    name: { az: 'Giriş zalı', en: 'Entrance Hall' },
    subtitle: { az: 'Bir hekayənin başlanğıcı', en: 'The beginning of a story' },
    panorama: assetPath('/panoramas/entrance.jpg'),
    initialYaw: 0,
    hotspots: [{ exhibitId: 'karabakh-carpet', yaw: -0.5, pitch: 0.08 }],
    links: [{ roomId: 'history', yaw: 0, pitch: -0.15 }],
  },
  {
    id: 'history',
    name: { az: 'Tarix zalı', en: 'History Hall' },
    subtitle: { az: 'Əsrlərdən gələn izlər', en: 'Traces across the centuries' },
    panorama: assetPath('/panoramas/history.jpg'),
    initialYaw: 0,
    hotspots: [
      { exhibitId: 'azerbaijani-dagger', yaw: -0.58, pitch: 0.035 },
      { exhibitId: 'ancient-coin', yaw: 0.565, pitch: 0 },
    ],
    links: [
      { roomId: 'culture', yaw: 0, pitch: -0.15 },
      { roomId: 'entrance', yaw: Math.PI, pitch: -0.25 },
    ],
  },
  {
    id: 'culture',
    name: { az: 'Ənənəvi mədəniyyət zalı', en: 'Traditional Culture Hall' },
    subtitle: {
      az: 'Əllərin yaddaşı, xalqın ruhu',
      en: 'The memory of hands, the spirit of a people',
    },
    panorama: assetPath('/panoramas/culture.jpg'),
    initialYaw: 0,
    hotspots: [
      { exhibitId: 'traditional-dress', yaw: -0.64, pitch: 0.04 },
      { exhibitId: 'copper-vessel', yaw: 0.64, pitch: 0.015 },
      { exhibitId: 'historic-ceramic', yaw: 1.095, pitch: -0.28 },
    ],
    links: [{ roomId: 'history', yaw: 0, pitch: -0.15 }],
  },
];
export const getRoom = (id: string) => rooms.find((room) => room.id === id)!;
