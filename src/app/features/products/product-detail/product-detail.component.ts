import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ProductService,
  Product,
} from '../../../core/services/product/product.service';
import { Observable, switchMap, tap, map } from 'rxjs';
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
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.product$ = this.route.params.pipe(
      switchMap((params) => this.productService.getProductById(params['id'])),
      tap((product) => {
        // Initialize quantity from cart when product loads
        this.cartService.cartItems$
          .pipe(
            tap((items) => {
              const cartItem = items.find(
                (item) => item.product.id === product.id
              );
              this.quantity = cartItem ? cartItem.quantity : 1;
            })
          )
          .subscribe();
      })
    );
  }

  ngOnInit(): void {}

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, this.quantity);
  }

  getProductQuantity(productId: string): Observable<number> {
    return this.cartService.cartItems$.pipe(
      map((items) => {
        const item = items.find((i) => i.product.id === productId);
        return item ? item.quantity : 1;
      })
    );
  }
}
