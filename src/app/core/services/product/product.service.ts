import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, map, combineLatest } from 'rxjs';
import { GET_ALL_CATEGORIES, GET_ALL_PRODUCTS, GET_PRODUCT_BY_ID } from '../../graphql/queries';

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
  category: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductsByCategory {
  id: string;
  name: string;
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private selectedCategorySubject = new BehaviorSubject<string>('all');

  selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor(private apollo: Apollo) {}

  getCategories(): Observable<Category[]> {
    return this.apollo
      .watchQuery<{ categories: Category[] }>({
        query: GET_ALL_CATEGORIES,
      })
      .valueChanges.pipe(map((result) => result.data.categories));
  }

  getProducts(): Observable<Product[]> {
    return this.apollo
      .watchQuery<{ products: Product[] }>({
        query: GET_ALL_PRODUCTS,
      })
      .valueChanges.pipe(map((result) => result.data.products));
  }

  setSelectedCategory(categoryId: string) {
    this.selectedCategorySubject.next(categoryId);
  }

  getProductsGroupedByCategory(): Observable<ProductsByCategory[]> {
    return combineLatest([
      this.getCategories(),
      this.getProducts(),
      this.selectedCategory$
    ]).pipe(
      map(([categories, products, selectedCategory]) => {
        return categories.map(category => ({
          ...category,
          products: products
            .filter(product => product.category.id === category.id)
            .slice(0, selectedCategory === 'all' ? 5 : undefined)
        }));
      })
    );
  }

  // Add to existing methods
getProductById(id: string): Observable<Product> {
  return this.apollo
    .watchQuery<{ product: Product }>({
      query: GET_PRODUCT_BY_ID,
      variables: { id }
    })
    .valueChanges.pipe(map((result) => result.data.product));
}
}


