// Feature barrel for the Books feature
// Re-export public pages, components and hooks. Keep this barrel focused on
// runtime UI/logic - avoid re-exporting server-only or build-time modules.

export * from './pages';
export * from './components';
export * from './hooks/useBookSearch';
