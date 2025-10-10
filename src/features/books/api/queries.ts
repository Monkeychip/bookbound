import { gql } from '@apollo/client';
import { BookCore, DetailPageFragment } from './fragments';

/**
 * Queries for the books feature.
 * Keep GraphQL operations near the feature so updates remain localized.
 */

export const BOOKS_QUERY = gql`
  query Books($limit: Int!, $skip: Int, $search: String, $sort: BooksSort) {
    books(limit: $limit, skip: $skip, search: $search, sort: $sort) {
      items {
        ...BookCore
      }
      total
      skip
      limit
    }
  }
  ${BookCore}
`;

export const BOOK_QUERY = gql`
  query Book($id: ID!) {
    book(id: $id) {
      ...DetailPage
    }
  }
  ${DetailPageFragment}
`;

export const BOOK_TITLE_QUERY = gql`
  query BookTitle($id: ID!) {
    book(id: $id) {
      id
      title
    }
  }
`;
