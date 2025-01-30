import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/services/product/product.service';
import { CartService } from '../../../../core/services/cart/cart.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    CommonModule, 
    MatGridListModule, 
    MatCardModule, 
    RouterLink, 
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent {
  @Input() products: Product[] = [];

  constructor(private cartService: CartService) {}

  addToCart(event: Event, product: Product): void {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Prevent event bubbling
    this.cartService.addToCart(product, 1);
  }
}
