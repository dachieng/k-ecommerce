import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  navigationItems = [
    { icon: 'home', label: 'HOME', link: '/' },
    { icon: 'category', label: 'CATEGORIES', link: '/categories' },
    { icon: 'shopping_cart', label: 'MY CART', link: '/cart' },
  ];
}
