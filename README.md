# gabrielaguiardantas.github.io

Personal portfolio of Gabriel Aguiar Dantas, available in Portuguese and English.

**Live:** https://gabrielaguiardantas.github.io/

## Stack

- [React 19](https://react.dev/) with TypeScript 7
- [Vite 8](https://vite.dev/) for the dev server and build
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting
- [Playwright](https://playwright.dev/) for end-to-end smoke tests
- GitHub Actions + GitHub Pages for deployment

The current language lives in a React context (`context/LanguageProvider.tsx` in each version), consumed through the `useLanguage()` hook. In v2, each state has its own address (`/`, `#explore`, `#about`…), read by the `useRoute()` hook, so the browser Back button undoes one step at a time. JetBrains Mono is served by the site itself ([`@fontsource-variable/jetbrains-mono`](https://fontsource.org/fonts/jetbrains-mono)).

## Requirements

- **Node.js 26**, pinned in [`.node-version`](.node-version). Version managers such as [fnm](https://github.com/Schniz/fnm) switch to it automatically inside the project folder.
- **Google Chrome**, used by the end-to-end tests (no Playwright browser download needed).

## Getting started

```sh
npm ci
npm run dev
```

The site runs at http://localhost:5173/.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Type-checks (`tsc -b`) and builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Lints with oxlint (fails on any warning) |
| `npm run test:e2e` | Runs the Playwright smoke tests |

## End-to-end tests

The tests in [`e2e/`](e2e) run on a desktop (1440×900) and a mobile (390×844) viewport.

[`v1.spec.ts`](e2e/v1.spec.ts) runs on v1 opened on its own (`/v1.html`) and checks that:

- the page renders the right layout for the viewport, in Portuguese by default;
- the flag buttons switch the language and back;
- resizing the window switches between the desktop and mobile layouts;
- clicking a nav item highlights it once the smooth scroll ends (desktop only).

[`v2.spec.ts`](e2e/v2.spec.ts) runs on v2 (`/`) and checks that:

- the identity column renders in Portuguese by default, switches the language and links only the official channels and the tools named in the footer;
- JetBrains Mono comes from the site itself;
- `<GAD />` opens the orbit, each section opens from it or straight from its address, and Back and Escape go back one step at a time;
- the orbit never covers the identity column and fits the screen at 1024, 1280, 1440 and 1920 px (desktop only);
- each section has its content in both languages, with the title typed in (or shown at once with reduced motion).

[`versions.spec.ts`](e2e/versions.spec.ts) checks the switch between versions:

- v1 opens over v2 in a full-screen iframe, in the current language, from the versions section of v2, and the back-to-2026 button returns to that section;
- the browser Back button undoes one action at a time, then returns to 2026, and Forward reopens v1;
- v2 only accepts switch messages from its own v1 iframe;
- v1 opened on its own reads `?lang=` and its back-to-2026 button goes to `/`.

Every test also fails on any console error, uncaught exception or failed request, including inside the iframe.

`npm run test:e2e` reuses a dev server already running on port 5173, or starts one. To watch the tests:

```sh
npm run test:e2e -- --headed          # visible browser
npm run test:e2e -- --ui              # Playwright UI mode
SLOWMO=600 npm run test:e2e -- --headed   # slowed down (PowerShell: $env:SLOWMO=600)
```

## Project structure

```
src/versions/
  v1/             the 2023 version, kept frozen
    components/   layout pieces (header, nav bar, footer, buttons)
    context/      language context and useLanguage() hook
    pages/        sections of the single page (about, stacks, projects, versions, contact)
    assets/       images and icons
  v2/             the current version, with its own layout
    components/   identity column, stage (<GAD /> and the orbit) and sections
    context/      language, version and route (address) state
e2e/              Playwright smoke tests
first_version/    the original static version of the site (2020)
```

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which installs dependencies with `npm ci`, builds the site and publishes `dist/` to GitHub Pages.
