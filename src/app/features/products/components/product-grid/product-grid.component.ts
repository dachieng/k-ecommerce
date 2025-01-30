import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../../core/services/product/product.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
}
