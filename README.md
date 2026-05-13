# Mainemer Media Website

This project runs the existing `index.html` site without changing its UI/UX behavior.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment

The output folder is `dist/`, produced by a no-transform static copy step, so the live site keeps the exact same behavior and visuals.
This makes the project ready for static hosting providers such as Vercel, Netlify, Cloudflare Pages, and GitHub Pages.
