import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {
  ProductService,
  Product,
  Category,
} from '../../../core/services/product/product.service';
import { ProductGridComponent } from '../components/product-grid/product-grid.component';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    ProductGridComponent,
    RouterLink
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  categories$: Observable<Category[]>;
  filteredProducts$: Observable<Product[]>;
  selectedCategory$: Observable<string>;

  constructor(private productService: ProductService) {
    this.selectedCategory$ = this.productService.selectedCategory$;
    this.categories$ = this.productService.getCategories();

    this.filteredProducts$ = combineLatest([
      this.productService.getProducts(),
      this.productService.selectedCategory$,
    ]).pipe(
      map(([products, selectedCategory]) => {
        if (selectedCategory === 'all') return products;
        return products.filter(
          (product) => product.category.id === selectedCategory
        );
      })
    );
  }

  ngOnInit(): void {}

  selectCategory(categoryId: string) {
    this.productService.setSelectedCategory(categoryId);
  }
}
