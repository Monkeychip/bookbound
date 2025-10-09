// Vite env types for TypeScript
// Defines the properties we use on import.meta.env

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL?: string;
  readonly DEV?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
