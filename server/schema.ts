// -----------------------------------------------------------------------------
// Defines Next Chapter's GraphQL schema and resolvers.
//
// This module translates between the public GraphQL API (Books, Queries,
// Mutations) and the external DummyJSON REST API.
//
// • The `typeDefs` string defines the GraphQL contract exposed to clients.
// • The `resolvers` object defines how each query or mutation fetches or mutates data.
// • DummyJSON's `/products` endpoints are used as a stand-in for Next Chapter's future API.
//
// Note: mapping "products" → "books" is knowingly a bit of a stretch.
// Some entries (e.g., “Powder Canister”) resemble plausible book-like titles,
// while others (“Mascara”, “Moisturizer”) do not. The goal here is to
// demonstrate realistic data flow and structure, and have a little fun.
//
// This pattern allows developers to query "Books" via GraphQL, while
// the backend logic can be swapped for a real database later without changing
// the UI data-access layer.
// -----------------------------------------------------------------------------

// DummyJSON API used to mock book data
// https://dummyjson.com/docs/products
const DUMMY_BASE = 'https://dummyjson.com';

type DummyProduct = {
  id: number;
  title: string;
  brand?: string;
  description?: string;
  rating?: number;
};

type DummyProductUpdate = {
  title?: string;
  brand?: string;
  description?: string;
  rating?: number;
};

type ProductListResponse = {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
};

// GraphQL "Book" type as exposed to clients
type Book = {
  id: number;
  title: string;
  author: string; // maps from DummyJSON "brand"
  description: string; // maps from "description"
  rating: number; // maps from "rating"
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// Covert the DummyJSON "product" into our Book object
function toBook(p: DummyProduct): Book {
  return {
    id: p.id,
    title: p.title,
    author: p.brand ?? 'Unknown',
    description: p.description ?? '',
    rating: typeof p.rating === 'number' ? p.rating : 0,
  };
}

function isProductListResponse(x: unknown): x is ProductListResponse {
  return (
    typeof x === 'object' && x !== null && Array.isArray((x as { products?: unknown }).products)
  );
}

function isDummyProduct(x: unknown): x is DummyProduct {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as { id?: unknown }).id === 'number' &&
    typeof (x as { title?: unknown }).title === 'string'
  );
}

// -----------------------------------------------------------------------------
// GRAPHQL SCHEMA & RESOLVERS
// -----------------------------------------------------------------------------
// GraphQL schema definition: CRUD operations for "Book" type
// (maps to DummyJSON /products endpoints)
export const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    rating: Float!
  }

  input BookCreateInput {
    title: String!
    author: String!
    description: String!
    rating: Float
  }

  input BookUpdateInput {
    id: ID!
    title: String
    author: String
    description: String
    rating: Float
  }

  type Query {
    books(search: String, limit: Int = 20, skip: Int = 0): [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    createBook(input: BookCreateInput!): Book!
    updateBook(input: BookUpdateInput!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;
// GraphQL resolvers: translates queries/mutations to REST calls
export const resolvers = {
  Query: {
    // Fetch paginated list of books (maps to DummyJSON /products or /products/search)
    books: async (
      _: unknown,
      { search, limit = 20, skip = 0 }: { search?: string; limit?: number; skip?: number },
    ) => {
      const url = search
        ? `${DUMMY_BASE}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
        : `${DUMMY_BASE}/products?limit=${limit}&skip=${skip}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);

      const data: unknown = await res.json();
      if (!isProductListResponse(data)) {
        throw new Error('Unexpected response shape from DummyJSON');
      }

      return data.products.map(toBook);
    },
    // Fetch a single book by ID
    book: async (_: unknown, { id }: { id: string }) => {
      const res = await fetch(`${DUMMY_BASE}/products/${id}`);
      if (!res.ok) return null;

      const data: unknown = await res.json();
      if (!isDummyProduct(data)) return null;

      return toBook(data);
    },
  },
  Mutation: {
    // Create a new "Book" using DummyJSON's /products/add
    createBook: async (_: unknown, { input }: { input: Partial<Book> }) => {
      const payload = {
        title: input.title,
        brand: input.author,
        description: input.description,
        rating: input.rating ?? 0,
      };

      const res = await fetch(`${DUMMY_BASE}/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);

      const data: unknown = await res.json();
      if (!isDummyProduct(data)) throw new Error('Unexpected response shape from DummyJSON');

      return toBook(data);
    },
    // Update an existing Book using DummyJSON's /products/:id
    updateBook: async (_: unknown, { input }: { input: Partial<Book> & { id: string } }) => {
      const { id, ...rest } = input;
      const payload: DummyProductUpdate = {};
      if (rest.title !== undefined) payload.title = rest.title;
      if (rest.author !== undefined) payload.brand = rest.author;
      if (rest.description !== undefined) payload.description = rest.description;
      if (rest.rating !== undefined) payload.rating = rest.rating;

      const res = await fetch(`${DUMMY_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);

      const data: unknown = await res.json();
      if (!isDummyProduct(data)) throw new Error('Unexpected response shape from DummyJSON');

      return toBook(data);
    },
    // Delete a book using DummyJSON's /products/:id
    deleteBook: async (_: unknown, { id }: { id: string }) => {
      const res = await fetch(`${DUMMY_BASE}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      return true;
    },
  },
};
