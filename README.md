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

## Publish to Vercel

The included `vercel.json` configures the Next.js build. No application environment variables are required. With access to your Vercel account, run:

```bash
npx vercel login
npx vercel deploy --prod --project museum
```

Choose your account/team when prompted. Vercel can assign `museum.vercel.app` only if that address is available to your account. Local dependency caches, build output, and environment files are excluded from deployment uploads.

## A 2–3 minute presentation

1. Start on `/` and choose **Virtual muzeyə daxil ol**.
2. Drag to look around the entrance hall. Select the pulsing carpet hotspot.
3. Open **Ətraflı bax** or play its **Audio hekayə**.
4. Close the panel and select the floating **Tarix zalı** arrow in the doorway.
5. Visit **Ənənəvi mədəniyyət zalı**. Select **Mis qab**, then **3D-də bax**.
6. Drag the bronze vessel to rotate it, scroll/pinch to zoom, and use the reset icon.
7. Return to the room and open **Xəritə** to travel between all three halls.
8. Use the collection icon to open `/collection` and demonstrate filters.

Alternatively, **Bələdçili tur** guides you through the carpet, dagger, and 3D vessel, with three progress steps. Major UI elements, exhibit stories, and narration support AZ/EN. Your language choice persists locally.

## Replace demo content

- `data/exhibits.ts`: six structured bilingual exhibits, categories, descriptions, extended stories, materials, images, and optional `model3D` paths.
- `data/rooms.ts`: three connected rooms and their panoramas, exhibit positions, and navigation links.
- `data/types.ts`: shared TypeScript types.
- `public/panoramas/`: **2:1 equirectangular** 360° JPEGs. Replace these with real museum photography, then adjust marker `yaw` and `pitch` in radians in the room configuration. Zero yaw looks toward the center of the image; positive pitch looks up.
- `public/exhibits/`: exhibit images. Keep the listed filenames or update the data.
- `public/models/bronze-vessel.glb`: a real local GLB. Replace it and update the relevant exhibit's model path. The current viewer is framed for a meter-scale object centered on the origin with its base at y=0. For other models, normalize the export or update the camera/target in `components/ModelViewer.tsx`.
- `public/audio/`: local Azerbaijani/English narration and an optional ambient bed. Narration paths follow `{exhibit-id}-{az|en}.mp3`.

Photo Sphere Viewer renders the full 360° panoramas and spatial hotspots. Three.js renders the artifact with orbit controls, local environment lighting, zoom limits, and camera reset. Framer Motion animates transitions and dialogs. Tailwind CSS v4 is available alongside the museum's visual styles in `app/globals.css`.

## Browser verification

The smoke test exercises actual application behavior: all routes and six exhibit hotspots, room navigation, map teleportation, guided-tour progress, real GLB loading and rotation, zoom/reset controls, audio playback, language persistence, collection filtering/search, modal keyboard dismissal, and mobile layouts. It reports failed browser requests and JavaScript errors.

```bash
# Once, if Chromium isn't already installed:
npx playwright install chromium

# With the app running:
npm run test:smoke
```

The test automatically uses `/usr/bin/chromium` when available. Set `CHROMIUM_PATH` to use another system browser. Set `MUSEUM_BASE_URL` to test a different local server, and `MUSEUM_SCREENSHOTS` to select an output folder (default `/tmp/museum-smoke`).

## Demo assets and scope

The interiors, six artifact images, and ornamental bronze vessel were originally rendered for this prototype. The carpet pattern and artifact forms are illustrative interpretations, **not verified scans of a museum's collection**. Dates and descriptions are demonstration content. Narration was synthesized locally with eSpeak NG; the ambient audio is an original generated sound bed. Use approved museum photographs, research, recordings, and scans for a real institutional presentation.

This prototype deliberately contains no authentication, payments, administration, CMS, analytics, or backend. It can be extended by adding data and replacing assets without redesigning the frontend.
