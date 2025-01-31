import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/services/product/product.service';
import { CartService } from '../../../../core/services/cart/cart.service';
import { Observable, map } from 'rxjs';
import { CartItem } from '../../../../core/services/cart/cart.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent implements OnInit {
  @Input() products: Product[] = [];
  @Input() loading = false;
  readonly cartItems$: Observable<CartItem[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit() {}

  getProductQuantity(productId: string): Observable<number> {
    return this.cartItems$.pipe(
      map((items) => {
        const item = items.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
      })
    );
  }

  addToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
  }
}
