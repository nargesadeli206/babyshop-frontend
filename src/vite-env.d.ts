// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // بیشتر متغیرهای محیطی رو می‌تونی اینجا تعریف کنی
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}