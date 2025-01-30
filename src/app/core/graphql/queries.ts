import { gql } from 'apollo-angular';

export const GET_ALL_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      price
      images
      category {
        id
        name
      }
    }
  }
`; 