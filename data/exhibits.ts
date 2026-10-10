import { Exhibit, Localized, Category } from './types';
import { assetPath } from '@/lib/assetPath';
export const categories: Record<Category, Localized> = {
  carpets: { az: 'Xalçalar', en: 'Carpets' },
  weapons: { az: 'Silahlar', en: 'Weapons' },
  clothing: { az: 'Geyim', en: 'Clothing' },
  archaeology: { az: 'Arxeologiya', en: 'Archaeology' },
};
export const exhibits: Exhibit[] = [
  {
    id: 'karabakh-carpet',
    name: { az: 'Qarabağ xalçası', en: 'Karabakh carpet' },
    description: {
      az: 'Qarabağ xalçaçılıq məktəbinə aid bu xalça Azərbaycanın zəngin toxuculuq ənənələrini əks etdirir.',
      en: 'This carpet reflects the rich weaving traditions of the Karabakh school and Azerbaijan’s enduring textile heritage.',
    },
    story: {
      az: 'Həndəsi naxışlar, isti rənglər və mərkəzi medalyonlar xalçaçılıq sənətinin özünəməxsus dilini yaradır. Hər ilmə nəsildən-nəslə ötürülən bir yaddaşın parçasıdır.',
      en: 'Geometric motifs, warm colors, and central medallions form a distinctive visual language. Every knot is a fragment of memory passed from one generation to the next.',
    },
    period: { az: '19-cu əsr', en: '19th century' },
    category: 'carpets',
    material: { az: 'Yun, təbii boyalar', en: 'Wool, natural dyes' },
    image: assetPath('/exhibits/carpet.jpg'),
    roomId: 'entrance',
  },
  {
    id: 'azerbaijani-dagger',
    name: { az: 'Azərbaycan xəncəri', en: 'Azerbaijani dagger' },
    description: {
      az: 'Zərif metal işləmələri ilə bəzədilmiş xəncər həm ustalığın, həm də tarixi silah mədəniyyətinin nümunəsidir.',
      en: 'A finely crafted dagger illustrating the skill of local metalworkers and the region’s historic arms culture.',
    },
    story: {
      az: 'Xəncərin sadə forması ilə işlənmiş dəstəyi sənət və funksiyanın vəhdətini göstərir. Bu cür əşyalar gündəlik həyatın, mərasimlərin və şəxsi kimliyin bir hissəsi olmuşdur.',
      en: 'The blade’s simple silhouette and decorated hilt unite craft and function. Objects like this belonged to daily life, ceremony, and personal identity.',
    },
    period: { az: '18-ci əsr', en: '18th century' },
    category: 'weapons',
    material: { az: 'Polad, tunc, ağac', en: 'Steel, bronze, wood' },
    image: assetPath('/exhibits/dagger.jpg'),
    roomId: 'history',
  },
  {
    id: 'copper-vessel',
    name: { az: 'Mis qab', en: 'Copper vessel' },
    description: {
      az: 'Ənənəvi misgərlik sənətini təmsil edən bu qab gündəlik məişətin estetik zənginliyini göstərir.',
      en: 'This vessel represents traditional coppersmithing and the quiet beauty of everyday objects.',
    },
    story: {
      az: 'Lahıc və digər sənətkarlıq mərkəzlərində metal qablar əsrlər boyu əl ilə hazırlanmışdır. Formanın tarazlığı və dekorativ halqalar ustaların materiala olan həssas münasibətini əks etdirir.',
      en: 'In Lahij and other craft centers, metal vessels have been shaped by hand for centuries. Balanced proportions and decorative rings reveal the maker’s sensitivity to the material.',
    },
    period: { az: '19-cu əsr', en: '19th century' },
    category: 'archaeology',
    material: { az: 'Mis və tunc — demo model', en: 'Copper and bronze — demo model' },
    image: assetPath('/exhibits/vessel.jpg'),
    model3D: assetPath('/models/bronze-vessel.glb'),
    roomId: 'culture',
  },
  {
    id: 'traditional-dress',
    name: { az: 'Milli geyim', en: 'Traditional dress' },
    description: {
      az: 'Məxmər və qızılı bəzəklər Azərbaycan milli geyimlərinin zərifliyini və rəng ahəngini nümayiş etdirir.',
      en: 'Velvet and golden details express the elegance and color harmony of Azerbaijani traditional clothing.',
    },
    story: {
      az: 'Ənənəvi geyim insanın yaşadığı bölgəni, zövqünü və həyat tərzini əks etdirirdi. Tikiş, biçim və bəzəklər yerli sənətkarlığın mühüm bir hissəsidir.',
      en: 'Traditional clothing reflected its wearer’s region, taste, and way of life. Tailoring, silhouettes, and ornament were important expressions of local craft.',
    },
    period: { az: '19-cu əsr', en: '19th century' },
    category: 'clothing',
    material: { az: 'Məxmər, dekorativ sap', en: 'Velvet, decorative thread' },
    image: assetPath('/exhibits/costume.jpg'),
    roomId: 'culture',
  },
  {
    id: 'ancient-coin',
    name: { az: 'Qədim sikkə', en: 'Ancient coin' },
    description: {
      az: 'Orta əsrlərin ticarət əlaqələrindən xəbər verən sikkə dövrünün iqtisadi və mədəni həyatına kiçik bir pəncərədir.',
      en: 'A small window into medieval economic and cultural life, this coin evokes the trade networks of its time.',
    },
    story: {
      az: 'Sikkələr yalnız mübadilə vasitəsi deyil, həm də dövrün rəmzlərini daşıyan tarixi mənbələrdir. Onların üzərindəki işarələr uzaq şəhərləri və ticarət yollarını birləşdirən hekayələr danışır.',
      en: 'Coins are both a means of exchange and historical records. Their symbols tell stories of distant cities and the trading routes that connected them.',
    },
    period: { az: '12-ci əsr', en: '12th century' },
    category: 'archaeology',
    material: { az: 'Metal ərintisi', en: 'Metal alloy' },
    image: assetPath('/exhibits/coin.jpg'),
    roomId: 'history',
  },
  {
    id: 'historic-ceramic',
    name: { az: 'Tarixi keramika', en: 'Historic ceramic' },
    description: {
      az: 'Torpağın sadə gözəlliyini qoruyan bu keramika nümunəsi qədim dulusçuluq ənənələrini xatırladır.',
      en: 'Preserving the simple beauty of clay, this ceramic recalls the region’s ancient pottery traditions.',
    },
    story: {
      az: 'Dulusçuluq torpaq, su və odun yaratdığı sənətdir. Sadə məişət qablarında belə nəsillərin formalaşdırdığı bilik və estetik duyum yaşayır.',
      en: 'Pottery is a craft shaped by earth, water, and fire. Even the simplest household vessel carries knowledge and a sense of beauty refined across generations.',
    },
    period: { az: 'Orta əsrlər', en: 'Middle Ages' },
    category: 'archaeology',
    material: { az: 'Bişmiş gil', en: 'Fired clay' },
    image: assetPath('/exhibits/ceramic.jpg'),
    roomId: 'culture',
  },
];
export const guidedExhibits = ['karabakh-carpet', 'azerbaijani-dagger', 'copper-vessel'];
export const getExhibit = (id: string) => exhibits.find((exhibit) => exhibit.id === id)!;
