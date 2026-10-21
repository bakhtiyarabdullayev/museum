import { Exhibit, Localized, Category } from './types';
import { assetPath } from '@/lib/assetPath';
export const categories: Record<Category, Localized> = {
  carpets: { az: 'Tekstil', en: 'Textiles' },
  weapons: { az: 'Silahlar', en: 'Arms & armour' },
  arts: { az: 'İncəsənət', en: 'Fine art' },
  archaeology: { az: 'Keramika', en: 'Ceramics' },
};
const records: Exhibit[] = [
  {
    id: 'brussels-tapestry',
    name: {
      az: 'Tarixi qobelen',
      en: 'Brussels tapestry',
    },
    description: {
      az: 'XVI əsrə aid Brüssel qobelenində toxuculuq sənəti ilə mifoloji hekayə bir araya gəlir.',
      en: 'A sixteenth-century Brussels tapestry brings together intricate weaving and a mythological narrative.',
    },
    story: {
      az: 'Hallwyl kolleksiyasındakı bu qobelenlər Odisseyin Nausikaa ilə görüşünü təsvir edir. Yun və ipək sapların yaratdığı zəngin səth zalın rənglərini və memarlıq ritmini tamamlayır.',
      en: 'The Hallwyl tapestries depict the meeting of Odysseus and Nausicaa. Their rich woven surfaces informed the room’s colors, proportions, and architectural details.',
    },
    period: {
      az: '16-cı əsr',
      en: '16th century',
    },
    category: 'carpets',
    material: {
      az: 'Yun və ipək',
      en: 'Wool and silk',
    },
    image: '/exhibits/tapestry.jpg',
    roomId: 'entrance',
    source: {
      name: 'Hallwyl Museum, Stockholm',
      url: 'https://hallwylskamuseet.se/en/',
    },
  },
  {
    id: 'ceremonial-armour',
    name: {
      az: 'Mərasim zirehi',
      en: 'Ceremonial armour',
    },
    description: {
      az: 'Polad lövhələrdən yığılmış bu zireh metal ustalarının dəqiqliyini və tarixi müdafiə sənətini nümayiş etdirir.',
      en: 'Assembled from shaped steel plates, this armour reveals the precision of historic metalworking.',
    },
    story: {
      az: 'Hallwyl silah kolleksiyasındakı alman zirehi XVI əsrin sonu və XVII əsrin əvvəlinə aid hissələrdən ibarətdir. Hərəkətli birləşmələr qorunma ilə hərəkət azadlığını birləşdirir.',
      en: 'This German suit in the Hallwyl armoury combines parts from the late sixteenth and early seventeenth centuries. Articulated joints balance protection with freedom of movement.',
    },
    period: {
      az: '16–17-ci əsrlər',
      en: '16th–17th centuries',
    },
    category: 'weapons',
    material: {
      az: 'Polad, dəri',
      en: 'Steel, leather',
    },
    image: '/exhibits/armour.jpg',
    roomId: 'history',
    source: {
      name: 'Hallwyl Museum, Stockholm',
      url: 'https://hallwylskamuseet.se/en/',
    },
  },
  {
    id: 'ceramic-vase',
    name: {
      az: 'Keramika vazası',
      en: 'Ceramic vase',
    },
    description: {
      az: 'Şirli səth, incə naxışlar və təbii material detalları keramika sənətinin zərifliyini göstərir. Eksponatın 3D arxiv nümunəsini də araşdırın.',
      en: 'Glazed surfaces, intricate decoration, and natural material detail reveal the subtlety of ceramic craft. Explore a textured 3D reference alongside the photographic collection.',
    },
    story: {
      az: 'Keramika zalında müxtəlif formalı vazalar, qablar və çini əşyalar nümayiş olunur. 3D təcrübədə Poly Haven arxivindən hazırlanmış ayrıca keramika vazası nümunəsi istifadə edilir; bu, əşyanı yaxından və hər tərəfdən araşdırmağa imkan verir.',
      en: 'The gallery presents vases, vessels, and porcelain in many forms. The interactive 3D study uses a separate ceramic vase asset from Poly Haven, allowing close inspection of its surface and shape from every angle.',
    },
    period: {
      az: 'Dekorativ sənət',
      en: 'Decorative arts',
    },
    category: 'archaeology',
    material: {
      az: 'Şirli keramika',
      en: 'Glazed ceramic',
    },
    image: '/exhibits/vase.jpg',
    model3D: '/models/ceramic-vase.glb',
    roomId: 'culture',
    source: {
      name: 'Hallwyl Museum, Stockholm',
      url: 'https://hallwylskamuseet.se/en/',
    },
    modelSource: {
      name: 'Poly Haven · ceramic_vase_01 (CC0)',
      url: 'https://polyhaven.com/a/ceramic_vase_01',
    },
  },
  {
    id: 'marble-relief',
    name: {
      az: 'Mərmər relyef',
      en: 'Prometheus marble relief',
    },
    description: {
      az: 'Gusten Lindberqin Karrara mərmərində işlədiyi relyef Prometeyin insanlara od gətirməsi hekayəsini canlandırır.',
      en: 'Gusten Lindberg’s Carrara marble relief depicts Prometheus bringing fire to mankind.',
    },
    story: {
      az: 'Açıq rəngli mərmər ilə qızılı çərçivənin təzadı relyefin fiqurlarını ön plana çıxarır. Əsər Hallwyl muzeyinin böyük salonunda, kaminin üzərində yerləşir.',
      en: 'Pale marble and an ornate gilded frame bring the figures into relief. The work sits above the fireplace in the Hallwyl Museum’s Great Drawing Room.',
    },
    period: {
      az: '19-cu əsr',
      en: '19th century',
    },
    category: 'arts',
    material: {
      az: 'Karrara mərməri',
      en: 'Carrara marble',
    },
    image: '/exhibits/relief.png',
    roomId: 'entrance',
    source: {
      name: 'Hallwyl Museum, Stockholm',
      url: 'https://hallwylskamuseet.se/en/',
    },
  },
  {
    id: 'historic-firearms',
    name: {
      az: 'Tarixi ov silahları',
      en: 'Historic hunting rifles',
    },
    description: {
      az: 'Taxta qundaqlar, incə metal işləmələri və müxtəlif mexanizmlər tarixi silah ustalığını nümayiş etdirir.',
      en: 'Wooden stocks, fine metalwork, and varied mechanisms reveal centuries of specialist gunsmithing.',
    },
    story: {
      az: 'Hallwyl silah kolleksiyasında XVI–XVIII əsrlərə aid ov tüfəngləri nümayiş olunur. Kolleksiya silahların texniki inkişafını və dekorativ ənənələrini müqayisə etməyə imkan verir.',
      en: 'The Hallwyl armoury includes hunting rifles from the sixteenth through eighteenth centuries. Its display lets visitors compare technical development and decorative traditions.',
    },
    period: {
      az: '16–18-ci əsrlər',
      en: '16th–18th centuries',
    },
    category: 'weapons',
    material: {
      az: 'Polad, ağac',
      en: 'Steel, wood',
    },
    image: '/exhibits/rifles.jpg',
    roomId: 'history',
    source: {
      name: 'Hallwyl Museum, Stockholm',
      url: 'https://hallwylskamuseet.se/en/',
    },
  },
  {
    id: 'porcelain-basket',
    name: {
      az: 'Çini səbət',
      en: 'Niderviller porcelain basket',
    },
    description: {
      az: 'Fransanın Niderviller emalatxanasında hazırlanmış qapaqlı çini səbət gündəlik əşyanı incə sənət nümunəsinə çevirir.',
      en: 'A lidded porcelain basket from the French Niderviller pottery transforms an everyday object into decorative art.',
    },
    story: {
      az: 'Təxminən 1785-ci ilə aid bu səbətlər qış aylarında şabalıd saxlamaq üçün istifadə olunurdu. Hallwyl kolleksiyasında onların naxışları və zərif işləmələri yaxından müşahidə edilə bilər.',
      en: 'Dating to around 1785, these baskets were intended for storing chestnuts through winter. Their fine decoration and delicate construction can be seen in the Hallwyl collection.',
    },
    period: {
      az: 'Təxminən 1785',
      en: 'Around 1785',
    },
    category: 'archaeology',
    material: {
      az: 'Bəzəkli çini',
      en: 'Decorated porcelain',
    },
    image: '/exhibits/basket.jpg',
    roomId: 'culture',
    source: {
      name: 'Hallwyl Museum, Stockholm',
      url: 'https://hallwylskamuseet.se/en/',
    },
  },
];
export const exhibits = records.map((exhibit) => ({
  ...exhibit,
  image: assetPath(exhibit.image),
  model3D: exhibit.model3D ? assetPath(exhibit.model3D) : undefined,
}));
export const guidedExhibits = ['brussels-tapestry', 'ceremonial-armour', 'ceramic-vase'];
export const getExhibit = (id: string) => exhibits.find((exhibit) => exhibit.id === id)!;
