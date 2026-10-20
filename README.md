# gabrielaguiardantas.github.io

Personal portfolio of Gabriel Aguiar Dantas, available in Portuguese and English.

**Live:** https://gabrielaguiardantas.github.io/

## Stack

- [React 19](https://react.dev/) with TypeScript 7
- [Vite 8](https://vite.dev/) for the dev server and build
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting
- [Playwright](https://playwright.dev/) for end-to-end smoke tests
- GitHub Actions + GitHub Pages for deployment

The current language lives in a React context (`src/context`), consumed through the `useLanguage()` hook.

## Requirements

- **Node.js 24**, pinned in [`.node-version`](.node-version). Version managers such as [fnm](https://github.com/Schniz/fnm) switch to it automatically inside the project folder.
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

The smoke tests in [`e2e/`](e2e) run on a desktop (1440×900) and a mobile (390×844) viewport and check that:

- the page renders the right layout for the viewport, in Portuguese by default;
- the flag buttons switch the language and back;
- resizing the window switches between the desktop and mobile layouts;
- clicking a nav item highlights it once the smooth scroll ends (desktop only);
- no console error, uncaught exception or failed request happens along the way.

`npm run test:e2e` reuses a dev server already running on port 5173, or starts one. To watch the tests:

```sh
npm run test:e2e -- --headed          # visible browser
npm run test:e2e -- --ui              # Playwright UI mode
SLOWMO=600 npm run test:e2e -- --headed   # slowed down (PowerShell: $env:SLOWMO=600)
```

## Project structure

```
src/
  components/   layout pieces (header, nav bar, footer, buttons)
  context/      language context and useLanguage() hook
  pages/        sections of the single page (about, stacks, projects, versions, contact)
  assets/       images and icons
e2e/            Playwright smoke tests
first_version/  the original static version of the site (2020)
```

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which installs dependencies with `npm ci`, builds the site and publishes `dist/` to GitHub Pages.
