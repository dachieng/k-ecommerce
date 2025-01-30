import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GET_ALL_CATEGORIES, GET_ALL_PRODUCTS } from '../../graphql/queries';

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
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
}
