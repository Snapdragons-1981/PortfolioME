# Wenrick's Digital Universe

An immersive, interactive 3D portfolio. Navigate a living solar system where every planet is a section of the portfolio — click a planet to travel through hyperspace and land inside its world, or unlock **Destruction Protocol** and play Solar-Smash-style with the planets.

Built with Next.js 14, React Three Fiber, and a heavy dose of sci-fi aesthetic.

## Features

- **3D Solar System** — Six orbiting, procedurally-textured planets (terrestrial, gas, and volcanic) around a pulsing sun, with moons, comets, asteroid belts, nebulas, and space dust.
- **Hyperspace travel** — Click any planet (or use the side navigation) to fly through a warp and enter that planet's themed 3D world (About, Skills, Projects, Experience, Education, Contact).
- **Living planet interiors** — Each planet interior now has hilly terrain, a backdrop city of glowing buildings, and animated walking people, themed to that planet.
- **Simulation time controls** — Play / Pause and speed presets (1x, 2x, 4x, 8x FLASH) that control orbits, moons, comets, and asteroids.
- **Destruction Protocol (sandbox mode)** — Click the sun 5 times to unlock a Solar-Smash-style weapon menu:
  - **ASTEROID** — lob a rock at a planet
  - **LASER** — green orbital beam that slices then detonates
  - **NUKE** — massive explosion with double shockwaves and heavy debris
  - **FIREWORK** — colorful non-destructive particle burst
  - Planets explode into flying debris, shockwaves, and fireballs. Reset the universe or exit anytime.
- **Futuristic UI** — boot sequence, holographic navigation, custom cursor, glitch effects, hackable terminal, and scanline aesthetics.
- **Fully responsive** — desktop-first, works down to tablet widths.

## Tech Stack

| Layer      | Tech |
| ---------- | ---- |
| Framework  | [Next.js 14](https://nextjs.org/) (App Router) |
| UI         | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Styling    | [Tailwind CSS](https://tailwindcss.com/) |
| 3D         | [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://drei.pmnd.rs/) + [Postprocessing](https://github.com/pmndrs/react-postprocessing) |
| Animation  | [Framer Motion](https://www.framer.com/motion/) + GSAP |
| Icons      | [Lucide React](https://lucide.dev/) |
| State      | [Zustand](https://zustand.docs.pmnd.rs/) |
| Toasts     | [Sonner](https://sonner.emilkowal.ski/) |

## Getting Started

### Prerequisites

- Node.js 18.17+ and npm

### Install

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env.local` and adjust:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

In production (Vercel), set `NEXT_PUBLIC_SITE_URL` to your live URL — it powers the site's OpenGraph metadata, `robots.txt`, and `sitemap.xml`.

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

## Deploying to Vercel

The project is Vercel-ready with zero extra configuration.

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repository (framework auto-detects **Next.js**).
3. Add the environment variable `NEXT_PUBLIC_SITE_URL` = your production URL.
4. Deploy. Pushes to the main branch redeploy automatically.

Alternatively, with the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
vercel
```

## Project Structure

```
src/
├── app/                 # App Router (page, layout, metadata, sitemap, robots)
├── components/          # Workspace (solar system), HUD controls, sandbox FX,
│                        # universe ambience, planet scene view, UI overlays
├── lib/                 # Procedural texture generation, shared world refs
├── planet-scenes/       # Per-planet 3D interior worlds + shared effects/cityscape
├── sections/            # Content sections rendered inside planet worlds
├── store/               # Zustand store (navigation, simulation, sandbox)
```

## License

This project is for personal portfolio use. Contact the owner for reuse permission.
