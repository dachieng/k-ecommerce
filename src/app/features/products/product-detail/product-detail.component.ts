import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ProductService,
  Product,
} from '../../../core/services/product/product.service';
import { Observable, switchMap, tap, map, take } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.product$ = this.route.params.pipe(
      switchMap((params) => this.productService.getProductById(params['id']))
    );
  }

  ngOnInit(): void {}

  decreaseQuantity(productId: string): void {
    this.getProductQuantity(productId).pipe(
      take(1),
      tap(currentQty => {
        if (currentQty > 1) {
          this.cartService.updateQuantity(productId, currentQty - 1);
        } else if (currentQty === 0) {
          // If not in cart, add with quantity 1
          this.product$.pipe(
            take(1),
            tap(product => this.cartService.addToCart(product, 1))
          ).subscribe();
        }
      })
    ).subscribe();
  }

  increaseQuantity(productId: string): void {
    this.getProductQuantity(productId).pipe(
      take(1),
      tap(currentQty => {
        if (currentQty > 0) {
          this.cartService.updateQuantity(productId, currentQty + 1);
        } else {
          // If not in cart, add with quantity 1
          this.product$.pipe(
            take(1),
            tap(product => this.cartService.addToCart(product, 1))
          ).subscribe();
        }
      })
    ).subscribe();
  }

  addToCart(product: Product): void {
    // Simply add to cart with quantity 1
    this.cartService.addToCart(product, 1);
  }

  getProductQuantity(productId: string): Observable<number> {
    return this.cartService.cartItems$.pipe(
      map((items) => {
        const item = items.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
      })
    );
  }
}
