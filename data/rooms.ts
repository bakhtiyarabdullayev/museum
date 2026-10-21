import { Room } from './types';
import { assetPath } from '@/lib/assetPath';
// Photographic Hallwyl Museum interiors; coordinates in radians, positive pitch looks up.
const records: Room[] = [
  {
    id: 'entrance',
    name: {
      az: 'Giriş zalı',
      en: 'Entrance Hall',
    },
    subtitle: {
      az: 'Qobelenlər, mərmər və saray sənəti',
      en: 'Tapestries, marble, and the art of the palace',
    },
    panorama: '/panoramas/entrance.jpg',
    preview: '/panoramas/entrance-preview.jpg',
    initialYaw: -1.94,
    initialPitch: 0.2,
    hotspots: [
      {
        exhibitId: 'brussels-tapestry',
        yaw: -2.4936,
        pitch: 0.4277,
      },
      {
        exhibitId: 'marble-relief',
        yaw: 0.0125,
        pitch: 0.8886,
      },
    ],
    links: [
      {
        roomId: 'history',
        yaw: -1.4105,
        pitch: -0.1,
      },
    ],
  },
  {
    id: 'history',
    name: {
      az: 'Tarix zalı',
      en: 'History Hall',
    },
    subtitle: {
      az: 'Zirehlər və tarixi silahlar',
      en: 'Centuries of metalwork and craftsmanship',
    },
    panorama: '/panoramas/history.jpg',
    preview: '/panoramas/history-preview.jpg',
    initialYaw: -0.55,
    initialPitch: 0.08,
    hotspots: [
      {
        exhibitId: 'ceremonial-armour',
        yaw: -1.1071,
        pitch: -0.2984,
      },
      {
        exhibitId: 'historic-firearms',
        yaw: 0.3971,
        pitch: 0.1309,
      },
    ],
    links: [
      {
        roomId: 'culture',
        yaw: -0.3462,
        pitch: -0.1031,
      },
      {
        roomId: 'entrance',
        yaw: -2.9497,
        pitch: -0.1208,
      },
    ],
  },
  {
    id: 'culture',
    name: {
      az: 'Ənənəvi mədəniyyət zalı',
      en: 'Traditional Culture Hall',
    },
    subtitle: {
      az: 'Çini kolleksiyası və keramika sənəti',
      en: 'Porcelain, ceramics, and the beauty of everyday objects',
    },
    panorama: '/panoramas/culture.jpg',
    preview: '/panoramas/culture-preview.jpg',
    initialYaw: 0,
    initialPitch: 0.06,
    hotspots: [
      {
        exhibitId: 'ceramic-vase',
        yaw: 0.46,
        pitch: 0.21,
      },
      {
        exhibitId: 'porcelain-basket',
        yaw: -0.6336,
        pitch: 0.2377,
      },
    ],
    links: [
      {
        roomId: 'history',
        yaw: -2.9212,
        pitch: -0.1,
      },
    ],
  },
];
export const rooms = records.map((room) => ({
  ...room,
  panorama: assetPath(room.panorama),
  preview: assetPath(room.preview),
}));
export const getRoom = (id: string) => rooms.find((room) => room.id === id)!;
