// src/app/features/cart/services/cart-api.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  originalPrice?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = new BehaviorSubject<CartItem[]>([]);
  items$ = this.items.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('bajaj_cart');
    if (saved) {
      try {
        this.items.next(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('bajaj_cart', JSON.stringify(this.items.value));
  }

  addItem(item: { productId: string; name: string; price: number; image: string; originalPrice?: number }) {
    const current = [...this.items.value];
    const existing = current.find(i => i.productId === item.productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      current.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        originalPrice: item.originalPrice
      });
    }

    this.items.next(current);
    this.saveToStorage();
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return;
    const updated = this.items.value.map(item =>
      item.productId === id ? { ...item, quantity } : item
    );
    this.items.next(updated);
    this.saveToStorage();
  }

  remove(id: string) {
    const filtered = this.items.value.filter(i => i.productId !== id);
    this.items.next(filtered);
    this.saveToStorage();
  }

  getTotal(): number {
    return this.items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItems(): CartItem[] {
    return this.items.value;
  }

  clear() {
    this.items.next([]);
    localStorage.removeItem('bajaj_cart');
  }
}

export { CartService as CartApi };