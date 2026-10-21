# Museum photography and artifact assets

The tour uses real photographs of the Hallwyl Museum in Stockholm as reference interiors for this Azerbaijani-language presentation demo. It does not claim to document an Azerbaijani museum's physical collection.

## Photographic interiors

Source: [Hallwyl Virtual Tour](https://github.com/mystic-myst/Hallwyl-Virtual-Tour), which provides photographs and collection descriptions from [Hallwyl Museum](https://hallwylskamuseet.se/en/).

| Demo room                | Photographed room      | Source directory                    |
| ------------------------ | ---------------------- | ----------------------------------- |
| Entrance Hall            | The Great Drawing Room | `tiles/4-the-great-drawing-room/3/` |
| History Hall             | The Armoury            | `tiles/6-the-armoury/3/`            |
| Traditional Culture Hall | The Porcelain Room     | `tiles/8-the-porcelain-room/3/`     |

The six photographed cube faces were reprojected into 6144 × 3072 equirectangular JPEGs. No artificial interior geometry or generated exhibits are used in these room images. The smaller room previews and five exhibit detail images are photographic views from the same panoramas. `public/exhibits/relief.png` comes from `pics/marble2.png` in the source tour.

Artifact names and dates follow the source tour's collection descriptions. The ceramic vase is a decorative-arts demonstration; its separate 3D reference is identified below. Source credits are also available inside the tour and exhibit panels.

## Textured 3D ceramic vase

- Asset: [ceramic_vase_01 — Poly Haven](https://polyhaven.com/a/ceramic_vase_01).
- License: [CC0](https://polyhaven.com/license).
- Bundled GLB source: [SlavaUlyankin/webar-model-viewer](https://github.com/SlavaUlyankin/webar-model-viewer/blob/master/models/ceramic_vase.glb).
- Local file: `public/models/ceramic-vase.glb`, including geometry and embedded PBR textures.

The model is an independent reference asset for the 3D demonstration, rather than a scan of an item in the Hallwyl photographs. The viewer normalizes its framing while preserving the source materials and textures.

## Narration

The Azerbaijani and English demonstration narration was regenerated for the new collection using eSpeak NG. The existing ambient sound bed remains an original demo asset. All runtime assets are served locally.
