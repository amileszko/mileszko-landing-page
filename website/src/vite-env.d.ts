/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_TAG_MANAGER_ID?: string
  readonly VITE_HOST_NAME: string
}
