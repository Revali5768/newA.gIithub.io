# NimbleNote AI — Site marketing (Vite + Tailwind)

**Date**: 2025-08-09

Single Page App (React) avec routes légères : `/sales`, `/consulting`, `/pricing`, `/help`, `/entreprise`, `/legal/terms`, `/legal/privacy`.

## Démarrage local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
# sorties dans /dist
```

## Déploiement rapide

### Vercel
- Importez ce repo sur Vercel (ou `npm i -g vercel && vercel`)
- Build: `npm run build`
- Output: `dist`
- **SPA** : `vercel.json` déjà ajouté pour servir `index.html` pour toutes les routes.

### Cloudflare Pages
- Créez un projet Pages et connectez ce repo
- Framework preset: **Vite**
- Build command: `npm run build`
- Output: `dist`
- **SPA** : `public/_redirects` déjà présent (/* /index.html 200)

### Netlify
- `npm install -g netlify-cli`
- `netlify deploy --build` puis `netlify deploy --prod`
- **SPA** : `_redirects` déjà présent (/* /index.html 200)

### GitHub Pages
- `npm run build`
- Copiez `dist/index.html` en `dist/404.html` (déjà géré ici au niveau racine) et publiez `/dist` via `gh-pages`.
- Pensez au fallback SPA.

## Remarques
- Placez vos installeurs dans `public/downloads/` et mettez à jour les liens de téléchargement dans le code si besoin.
- Mettez à jour `public/sitemap.xml` avec votre domaine.
- SEO de base déjà en place (`index.html` : title, description, JSON-LD SoftwareApplication).
- Accessibilité : focus visibles, landmarks ARIA, contraste AA.

Bon déploiement !
