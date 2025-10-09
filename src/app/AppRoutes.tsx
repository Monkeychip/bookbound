import { Routes, Route, Navigate } from 'react-router-dom';
import { BooksList, BookDetail, CreateBookPage, BookEditPage } from '@features/books';
import { AboutPage } from './AboutPage';
import { Layout } from './Layout';

// -----------------------------------------------------------------------------
// AppRoutes
//
// Centralized route definitions for Next Chapter.
//
// Planned CRUD route map:
//
//   • `/books`
//       📚 LIST view for all books. Supports pagination, sorting, and filtering via query params (?page=&sort=&q=&filter=).
//       Handles bulk DELETE actions:
//         – Delete selected (confirm modal + count summary)
//         – Delete filtered results (with typed confirmation and filter summary)
//         – Delete ALL books (global delete, "DELETE ALL BOOKS" confirmation)
//       TODO: Add bulk-selection UI and delete modals.
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
//       TODO: Accessibility with save + cancel.
//
//   • `/about`
//       ℹ️ Static informational page.
//
//   • `/` and all unknown routes
//       Redirect → `/books`
//
// Notes:
//   – `/books` handles all list-level delete operations (bulk + global).
//   – `/books/:bookId/delete` will handle single deletes with modal.
//   – Route hierarchy designed for clarity, undo safety, and easy CRUD expansion.
// -----------------------------------------------------------------------------

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/books/:bookId" element={<BookDetail />} />
        <Route path="/books/new" element={<CreateBookPage />} />
        <Route path="/books/:bookId/edit" element={<BookEditPage />} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Route>
    </Routes>
  );
}
