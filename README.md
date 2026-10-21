# İRS — Interactive Azerbaijani Virtual Museum

A presentation-ready frontend prototype of a digital Azerbaijani museum. Default language: Azerbaijani. No backend, account, database, API key, or external asset service is needed.

## Run locally

Requires Node.js **20.9+** (Node.js 24 recommended).

```bash
npm install
npm run dev
```

Open the development server shown in the terminal (port 3000 by default).

```bash
npm run typecheck
npm run build
npm start
```

All three routes are statically prerendered. Fonts, panoramas, artifact photographs, 3D geometry, and audio are served locally. JavaScript libraries are lazy-loaded for the panoramic and 3D experiences.

## View on GitHub Pages

Website address: **https://bakhtiyarabdullayev.github.io/museum/**.

Enable hosting once in **Settings → Pages**: select **Deploy from a branch**, choose **gh-pages**, select **/ (root)**, and click **Save**. Allow a few minutes for GitHub to publish the site.

The Pages workflow automatically builds and updates the `gh-pages` branch when code is pushed to `main`. It uses a static Next.js export with the `/museum` base path; images, panoramas, audio, and 3D models use the same prefix. Local development and Vercel builds keep their usual root paths.

To generate the Pages files locally:

```bash
GITHUB_PAGES=true npm run build
```

The generated website is in `out/`.

## Publish to Vercel

The included `vercel.json` configures the Next.js build. No application environment variables are required. With access to your Vercel account, run:

```bash
npx vercel login
npx vercel deploy --prod --project museum
```

Choose your account/team when prompted. Vercel can assign `museum.vercel.app` only if that address is available to your account. Local dependency caches, build output, and environment files are excluded from deployment uploads.

## A 2–3 minute presentation

1. Start on `/` and choose **Virtual muzeyə daxil ol**.
2. Drag to look around the real photographic entrance hall. Select the numbered tapestry hotspot.
3. Open **Ətraflı bax** or play its **Audio hekayə**.
4. Close the panel and select the large floating **Tarix zalı** chevrons in the doorway. Labeled back/forward arrows also connect rooms on desktop and mobile.
5. Visit **Ənənəvi mədəniyyət zalı**. Select **Keramika vazası**, then **3D-də bax**.
6. Drag the textured ceramic vase to rotate it, scroll/pinch to zoom, and use the reset icon.
7. Use the **3D** button in any room to open the vase or antique camera. Open **Xəritə** to travel between all three halls.
8. Use the collection icon to open `/collection` and demonstrate filters.

Alternatively, **Bələdçili tur** guides you through the tapestry, armour, and 3D vase, with three progress steps. Major UI elements, exhibit stories, and narration support AZ/EN. Your language choice persists locally. The room's exhibit index also opens each photographed object directly.

## Replace demo content

- `data/exhibits.ts`: seven structured bilingual exhibits (six photographed room objects and one additional 3D archive study), categories, descriptions, extended stories, materials, images, and optional `model3D` paths.
- `data/rooms.ts`: three connected rooms and their panoramas, exhibit positions, and navigation links.
- `data/types.ts`: shared TypeScript types.
- `public/panoramas/`: **2:1 equirectangular** 360° JPEGs. Replace these with real museum photography, then adjust marker `yaw` and `pitch` in radians in the room configuration. Zero yaw looks toward the center of the image; positive pitch looks up.
- `public/exhibits/`: exhibit images. Keep the listed filenames or update the data.
- `public/models/`: locally bundled, textured ceramic vase (Poly Haven) and antique camera (UX3D) GLBs. The viewer automatically centers and scales imported models to fit its presentation stage. Models load only when selected.
- `public/audio/`: local Azerbaijani/English narration and an optional ambient bed. Narration paths follow `{exhibit-id}-{az|en}.mp3`.

Photo Sphere Viewer renders the full 360° panoramas and spatial hotspots. Three.js renders the artifact with orbit controls, local environment lighting, zoom limits, and camera reset. Framer Motion animates transitions and dialogs. Tailwind CSS v4 is available alongside the museum's visual styles in `app/globals.css`.

## Browser verification

The smoke test exercises actual application behavior: all routes, six exhibit hotspots, directional arrows on desktop and mobile, map teleportation, guided-tour progress, both textured GLBs loading and rotating, zoom/reset controls, the 3D collection, audio playback, language persistence, collection filtering/search, modal keyboard dismissal, and mobile layouts. It reports failed browser requests and JavaScript errors.

```bash
# Once, if Chromium isn't already installed:
npx playwright install chromium

# With the app running:
npm run test:smoke
```

The test automatically uses `/usr/bin/chromium` when available. Set `CHROMIUM_PATH` to use another system browser. Set `MUSEUM_BASE_URL` to test a different local server, and `MUSEUM_SCREENSHOTS` to select an output folder (default `/tmp/museum-smoke`).

## Demo assets and scope

The virtual tour uses photographic Hallwyl Museum interiors, real photographed collection objects, a textured Poly Haven ceramic vase, and a UX3D antique camera. These are international reference assets for an Azerbaijani-language demo. The two models are separate 3D references, identified in the viewer. See [ASSET_CREDITS.md](ASSET_CREDITS.md) for sources and processing details. Narration matches the collection and was synthesized locally with eSpeak NG.

This prototype deliberately contains no authentication, payments, administration, CMS, analytics, or backend. It can be extended by adding data and replacing assets without redesigning the frontend.
