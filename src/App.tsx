import { BooksList } from './features/books/BooksList';
import { AppLayout } from './layouts/AppLayout';

export default function App() {
  return (
    <AppLayout>
      <BooksList />
    </AppLayout>
  );
}
