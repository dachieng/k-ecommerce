import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes')
      .then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories.routes')
      .then(m => m.CATEGORY_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes')
      .then(m => m.CART_ROUTES)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes')
      .then(m => m.CHECKOUT_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
