import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
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
  imports: [CommonModule, MatTabsModule, ProductGridComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  categories$: Observable<Category[]>;
  filteredProducts$: Observable<Product[]>;

  constructor(private productService: ProductService) {
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

  onCategoryChange(event: any) {
    this.categories$.pipe(take(1)).subscribe((categories) => {
      const categoryId =
        event.index === 0 ? 'all' : categories[event.index - 1]?.id;
      if (categoryId) {
        this.productService.setSelectedCategory(categoryId);
      }
    });
  }
}
