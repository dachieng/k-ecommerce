import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ProductService,
  Product,
  Category,
  ProductsByCategory,
} from '../../../core/services/product/product.service';
import { ProductGridComponent } from '../components/product-grid/product-grid.component';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ProductGridComponent,
    RouterLink,
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  categories$: Observable<Category[]>;
  productsByCategory$: Observable<ProductsByCategory[]>;
  selectedCategory$: Observable<string>;
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  constructor(private productService: ProductService) {
    this.selectedCategory$ = this.productService.selectedCategory$;
    this.categories$ = this.productService.getCategories();

    this.productsByCategory$ = combineLatest([
      this.productService.getProductsGroupedByCategory(),
      this.selectedCategory$,
      this.searchQuery$
    ]).pipe(
      map(([categoriesWithProducts, selectedCategory, searchQuery]) => {
        return categoriesWithProducts
          .map(category => ({
            ...category,
            products: category.products.filter(product =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          }))
          .filter(category => 
            (selectedCategory === 'all' || category.id === selectedCategory) && 
            category.products.length > 0
          );
      })
    );
  }

  ngOnInit(): void {}

  selectCategory(categoryId: string) {
    this.productService.setSelectedCategory(categoryId);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuerySubject.next(value);
  }
}
