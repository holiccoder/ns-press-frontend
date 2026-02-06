# GitHub Copilot instructions for this repo

Quick summary
- Tech: React 18 + Vite, Ant Design 5, Less for styles, Axios for HTTP. (see `package.json`, `vite.config.js`)
- Dev scripts: `npm run dev` (local), `npm run build`, `npm run preview`, `npm run lint` (ESLint configured for .js/.jsx).
- Entry: `src/main.jsx` -> `src/App.jsx` (routes & providers)

Big picture (what to know fast)
- Single Page App using client-side routing defined in `src/App.jsx`.
  - Routes map to `src/pages/*` components. Add routes by editing `App.jsx`.
- UI: `src/components/*` are small presentational sections; each component has a co-located `.less` file (e.g., `Header.jsx` + `Header.less`).
- Global providers:
  - `LanguageProvider` (in `src/contexts/LanguageContext.jsx`) wraps the app and controls `language` ('zh' | 'en'). Changing language writes to `localStorage` and triggers a full page reload.
  - Ant Design config is selected in `src/config/antdConfig.js` via `getAntdConfig(language)` (returns `locale` + `theme.token`).
- HTTP/API layer centralized in `src/services/api.js`:
  - `API_BASE_URL` (currently hard-coded) is the single source of truth for backend URL.
  - Axios request interceptor automatically adds a language param: `lang: '中文' | 'English'`.
  - Axios response interceptor returns `response.data` (the server body). Many pages then access `response.data.*` (e.g., `response.data.lists`). Example: `HomePage` calls `journalAPI.getJournalList()` and uses `response.data.lists`.
  - Uploads use `multipart/form-data` via `submissionAPI.uploadFile(file)`.

Patterns & conventions (concrete)
- Files: component + style pairing: `XYZ.jsx` + `XYZ.less` and pages under `src/pages`.
- Localization: code toggles based on `language` from `useLanguage()`; many pages keep bilingual text inline (see `SubmissionPage.jsx` and `Footer.jsx`).
- API responses: assume server envelope ` { code, data: { ... } } `. Code typically uses `response.data.*` to access payload.
- Error handling is minimal and localized; follow existing pattern: catch and show `message.error(...)` (AntD) inside UI components.
- CSS: global `src/styles/*.less` + per-component `.less`. No CSS modules in use.

Where to change common things (quick edits)
- Change backend URL: edit `src/services/api.js` (look for `API_BASE_URL`).
- Add theme tokens / locale overrides: edit `src/config/antdConfig.js`.
- Add/modify routes: edit `src/App.jsx` and add page files under `src/pages`.
- Add a new component: create `src/components/MyComponent.jsx` and `src/components/MyComponent.less`.

Developer workflows
- Start dev server: `npm run dev` (Vite default port 5173).
- Build for production: `npm run build` then `npm run preview` to locally serve the build.
- Run linter: `npm run lint` (eslint configured for .js/.jsx).
- No tests or CI configs were found in the repo (no `test` script, no `.github/workflows`); expect manual QA in dev mode.

Important gotchas & notes for code generation
- Language switching triggers a full-page navigation (not SPA-only) — account for this when injecting state or adding routes.
- API client normalizes responses: the resolved value from `journalAPI.getJournalList()` is the server body (so generated code should access `response.data` as the codebase currently does).
- File upload flows use `customRequest` / `FormData` and expect the backend to return `{ data: { uri } }` (see `SubmissionPage.jsx`).
- Avoid introducing TypeScript or CSS Modules unless the team intends to migrate; the codebase uses plain JSX + .less and small conventions.

Examples (copy/paste patterns)
- Client call and list usage:
  const res = await journalAPI.getJournalList();
  setJournalList(res.data.lists);
  (see `src/pages/HomePage.jsx`)

- Language toggle:
  changeLanguage('en') // writes localStorage and reloads the page (see `src/contexts/LanguageContext.jsx`)

If anything above is incorrect or you want more detail (CI, env, proxy, or testing guidance), tell me which part to expand or any missing assumptions and I'll update this file. 

---
Generated/updated by an AI assistant — ask for clarifications or to include more examples from specific files.