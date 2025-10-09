import { gql } from '@apollo/client';
import { BookDetailFragment } from './fragments';

/**
 * Mutations used by the books feature. These mutations return the BookDetail
 * fragment when appropriate so callers can update the cache reliably.
 */

export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookCreateInput!) {
    createBook(input: $input) {
      ...BookDetail
    }
  }
  ${BookDetailFragment}
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($input: BookUpdateInput!) {
    updateBook(input: $input) {
      ...BookDetail
    }
  }
  ${BookDetailFragment}
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;
