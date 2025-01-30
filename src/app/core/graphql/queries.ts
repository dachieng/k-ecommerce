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


export const GET_PRODUCT_BY_ID = gql`
  query ProductDetail($id: ID!) {
    product(id: $id) {
      id
      title
      price
      images
      description
      category {
        id
        name
      }
    }
  }
`;