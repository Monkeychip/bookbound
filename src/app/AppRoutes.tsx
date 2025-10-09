import { Routes, Route, Navigate } from 'react-router-dom';
import { BooksList } from '../features/books/BooksList';
import { BookDetail } from '../features/books/BookDetail';
import { CreateBookPage } from '../features/books/CreateBookPage';
import { AboutPage } from './AboutPage';

// -----------------------------------------------------------------------------
// AppRoutes
//
// Centralized route definitions for Bookbound.
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
//       TODO: Move creation form and add validation.
//
//   • `/books/:bookId`
//       🔍 READ book details (R in CRUD)
//       TODO: Add layout, metadata, and edit/delete links. Accessible from List view.
//
//   • `/books/:bookId/edit`
//       🧩 UPDATE an existing book (U + D in CRUD)
//       Separate route for clean back navigation.
//       TODO: Add edit form with optimistic save + cancel.
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
      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route path="/books" element={<BooksList />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/books/:bookId" element={<BookDetail />} />
      <Route path="/books/new" element={<CreateBookPage />} />
      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  );
}
