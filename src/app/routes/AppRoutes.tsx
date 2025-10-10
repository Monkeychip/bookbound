import { Routes, Route, Navigate } from 'react-router-dom';
import { DetailPage, CreatePage, EditPage, ListPage } from '@/features/books';
import { AboutPage } from './AboutPage';
import { Layout } from './Layout';

/**
 * AppRoutes
 *
 * Top-level route configuration for the application.
 * Route planner comments remain below for development notes.
 */
//----Planned CRUD route map:--------------------------------------------------
//
//   • `/books`
//       📚 LIST view for all books. Supports pagination, sorting, and filtering.
//       TODO: Handle bulk DELETE actions:
//         – Delete selected (confirm modal + count summary)
//         – Delete filtered results (with typed confirmation and filter summary)
//         – Delete ALL books (global delete, "DELETE ALL BOOKS" confirmation)
//
//   • `/books/new`
//       ✏️ CREATE a new book (C in CRUD)
//       TODO: add validation.
//
//   • `/books/:bookId`
//       🔍 READ book details (R in CRUD)
//
//   • `/books/:bookId/edit`
//       🧩 UPDATE an existing book (U + D in CRUD)
//       Separate route for clean back navigation.
//
//   • `/about`
//       ℹ️ Static informational page.
//       TODO: add text.
//
//   • `/` and all unknown routes
//       Redirect → `/books`
//
// Notes:
//   – `/books` handles all list-level delete operations (bulk + global).
//   – Route hierarchy designed for clarity, undo safety, and easy CRUD expansion.
// ---------------------------------------------------------------------

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<ListPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/books/:bookId" element={<DetailPage />} />
        <Route path="/books/new" element={<CreatePage />} />
        <Route path="/books/:bookId/edit" element={<EditPage />} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Route>
    </Routes>
  );
}
