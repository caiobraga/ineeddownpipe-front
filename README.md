# ineeddownpipe-front

React UI for comparing BMW downpipe prices (US market). Static SPA — talks to **ineeddownpipe-back** via `VITE_API_URL`.

**Standalone GitHub repository** — deploy with its own AWS CodeBuild pipeline (S3 + CloudFront or Amplify).

## Local development

```bash
cp .env.example .env
# Leave VITE_API_URL empty to proxy /api to localhost:3001
npm install
npm run dev
```

Site: http://localhost:5173 (requires API running separately).

With API URL:

```bash
echo "VITE_API_URL=http://localhost:3001" > .env
npm run dev
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Public backend URL, no trailing slash (required in production) |
| `VITE_SITE_URL` | Public site URL for canonical, sitemap, and Open Graph (no trailing slash) |

## SEO

Static files in `public/`: `robots.txt`, `sitemap.xml`. Set `VITE_SITE_URL` before `npm run build` so `scripts/generate-seo-files.mjs` rewrites URLs in those files.

The app injects JSON-LD (`WebSite`, `Organization`, `ItemList`) and updates meta tags when the catalog loads.

## AWS deployment (CodeBuild → S3 → CloudFront)

1. Create an **S3** bucket for static hosting (block public access; use CloudFront OAC).
2. Create a **CloudFront** distribution pointing to the bucket.
3. Create a **CodeBuild** project connected to this GitHub repo.
4. Use `buildspec.yml`.
5. Set environment variables:
   - `FRONTEND_S3_BUCKET`
   - `VITE_API_URL` — e.g. `https://api.yourdomain.com`
   - `CLOUDFRONT_DISTRIBUTION_ID` (optional, for cache invalidation)
6. CodeBuild role needs: `s3:PutObject`, `s3:DeleteObject`, `cloudfront:CreateInvalidation`.

### AWS Amplify Hosting

1. Connect this repo in Amplify.
2. Set build spec to `buildspec.amplify.yml` or the default Vite commands.
3. Add env var `VITE_API_URL` in Amplify **Environment variables**.

## Production build

```bash
VITE_API_URL=https://api.example.com npm run build
```

Output in `dist/`.

## Backend CORS

Set on the API repo:

```
CORS_ORIGIN=https://www.yourdomain.com
```

Must match your CloudFront / site URL.

## Repo layout

```
.
├── buildspec.yml           # CodeBuild → S3 + CloudFront
├── buildspec.amplify.yml   # Amplify alternative
├── src/
└── dist/                   # build output (gitignored)
```
