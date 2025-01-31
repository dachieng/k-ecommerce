import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { GET_ALL_CATEGORIES } from '../../graphql/queries';

export interface Category {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apollo: Apollo) { }

  getCategories(): Observable<Category[]> {
    return this.apollo
      .watchQuery<{ categories: Category[] }>({
        query: GET_ALL_CATEGORIES,
      })
      .valueChanges.pipe(map((result) => result.data.categories));
  }
}
