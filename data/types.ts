export type Language = 'az' | 'en';
export type Localized = Record<Language, string>;
export type Category = 'carpets' | 'weapons' | 'clothing' | 'archaeology';
export type Exhibit = {
  id: string;
  name: Localized;
  description: Localized;
  story: Localized;
  period: Localized;
  category: Category;
  material: Localized;
  image: string;
  model3D?: string;
  roomId: string;
};
export type Hotspot = { exhibitId: string; yaw: number; pitch: number };
export type Room = {
  id: string;
  name: Localized;
  subtitle: Localized;
  panorama: string;
  initialYaw: number;
  hotspots: Hotspot[];
  links: { roomId: string; yaw: number; pitch: number }[];
};
