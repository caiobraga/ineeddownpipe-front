/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_ALLOW_REFRESH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
