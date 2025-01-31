import { Component, OnInit, AfterViewInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
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
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  categories$: Observable<Category[]>;
  productsByCategory$: Observable<ProductsByCategory[]>;
  selectedCategory$: Observable<string>;
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  images = [
    'assets/images/advert1.jpg',
    'assets/images/advert2.jpg',
    'assets/images/advert3.jpg',
    'assets/images/advert4.jpg',
    'assets/images/advert5.jpg',
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.selectedCategory$ = this.productService.selectedCategory$;
    this.categories$ = this.productService.getCategories();

    // Initialize category from URL params
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (params['category']) {
        this.productService.setSelectedCategory(params['category']);
      }
    });

    this.productsByCategory$ = combineLatest([
      this.productService.getProductsGroupedByCategory(),
      this.selectedCategory$,
      this.searchQuery$,
    ]).pipe(
      map(([categoriesWithProducts, selectedCategory, searchQuery]) => {
        return categoriesWithProducts
          .map((category) => ({
            ...category,
            products: category.products.filter((product) =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter(
            (category) =>
              (selectedCategory === 'all' ||
                category.id === selectedCategory) &&
              category.products.length > 0
          );
      })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    const swiperEl = document.querySelector('swiper-container');
    if (!swiperEl) return;
    
    const swiperParams = {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      navigation: true,
      pagination: {
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    };

    Object.assign(swiperEl, swiperParams);
    // @ts-ignore - initialize() exists on Swiper element
    swiperEl.initialize();
  }

  selectCategory(categoryId: string) {
    this.productService.setSelectedCategory(categoryId);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuerySubject.next(value);
  }
}
