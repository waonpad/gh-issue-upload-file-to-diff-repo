/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REPO: string;
  readonly VITE_UPLOAD_REPO_ID: string;
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// permissionsにtabsを追加している場合、urlは必ず存在する
declare namespace chrome.tabs {
  interface Tab {
    url: string;
  }
}
