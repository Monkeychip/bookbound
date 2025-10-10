import { gql } from '@apollo/client';
import { DetailPageFragment } from './fragments';

/**
 * Mutations used by the books feature. These mutations return the DetailPage
 * fragment when appropriate so callers can update the cache reliably.
 */

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreatePageInput!) {
    createBook(input: $input) {
      ...DetailPage
    }
  }
  ${DetailPageFragment}
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($input: BookUpdateInput!) {
    updateBook(input: $input) {
      ...DetailPage
    }
  }
  ${DetailPageFragment}
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;
