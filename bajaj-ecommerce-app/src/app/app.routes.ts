// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard-guard';
import { AdminGuard } from './shared/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/components/products-list/products-list').then(m => m.ProductsList)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/products/components/product-details/product-details').then(m => m.ProductDetails)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/components/categories-list/categories-list').then(m => m.CategoriesList)
  },
  {
    path: 'category/:id',
    loadComponent: () => import('./features/categories/components/category-details/category-details').then(m => m.CategoryDetails)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then(m => m.Cart)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout),
    canActivate: [AuthGuard.activate] // USER MUST BE LOGGED IN
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders/orders').then(m => m.Orders),
    canActivate: [AuthGuard.activate] // USER MUST BE LOGGED IN
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/orders/order-details/order-details').then(m => m.OrderDetails),
    canActivate: [AuthGuard.activate] // USER MUST BE LOGGED IN
  },
  {
    path: 'admin/admin-dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [AdminGuard.activate] // ADMIN ONLY
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];