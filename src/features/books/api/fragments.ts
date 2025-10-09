import { gql } from '@apollo/client';

/**
 * GraphQL fragments for the books feature.
 *
 * - BookCore: minimal fields used in lists.
 * - BookDetail: extends BookCore with fields needed for detail/edit views.
 *
 * Keeping fragments colocated with the feature makes it easier to update
 * selections and ensures queries/mutations reuse them consistently.
 */
export const BookCore = gql`
  fragment BookCore on Book {
    id
    title
    author
    rating
  }
`;
export const BookDetailFragment = gql`
  fragment BookDetail on Book {
    ...BookCore
    description
  }
  ${BookCore}
`;
