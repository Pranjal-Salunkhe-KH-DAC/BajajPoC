// src/app/features/cart/cart.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService as CartApi, CartItem } from './services/cart-api';
import { NavBar, Footer } from '../../shared/components';

@Component({
  selector: 'bajaj-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBar, Footer],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit, OnDestroy {
  private cartApi = inject(CartApi);
  private router = inject(Router);
  private sub = new Subscription();

  protected cartItems: CartItem[] = [];
  protected total = 0;

  ngOnInit() {
    this.sub.add(
      this.cartApi.items$.subscribe((items: CartItem[]) => {
        this.cartItems = items;
        this.total = this.cartApi.getTotal();
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  protected getTotal(): number {
    return this.total;
  }

  protected updateQuantity(id: string, qty: number) {
    this.cartApi.updateQuantity(id, qty);
  }

  protected removeItem(id: string) {
    this.cartApi.remove(id);
  }

  protected clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartApi.clear();
    }
  }

  protected checkout() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/checkout' } 
      });
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}