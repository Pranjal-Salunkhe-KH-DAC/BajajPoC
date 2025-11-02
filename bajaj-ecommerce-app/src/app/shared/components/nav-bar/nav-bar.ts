// src/app/shared/components/nav-bar/nav-bar.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService as CartApi, CartItem } from '../../../features/cart/services/cart-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bajaj-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit, OnDestroy {
  private cartApi = inject(CartApi);
  private router = inject(Router);
  private sub = new Subscription();

  protected cartCount = 0;
  protected isLoggedIn = false;
  protected userName = '';
  protected isAdmin = false;
  protected isMenuOpen = false;
  protected isSidebarOpen = false;

  ngOnInit() {
    this.sub.add(
      this.cartApi.items$.subscribe((items: CartItem[]) => {
        this.cartCount = items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
      })
    );

    this.loadUserInfo();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private loadUserInfo() {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    this.isLoggedIn = !!token;
    this.userName = user.name || 'User';
    this.isAdmin = user.role === 'admin';
  }

  toggleMenu() { 
    this.isMenuOpen = !this.isMenuOpen; 
  }
  
  toggleSidebar() { 
    this.isSidebarOpen = !this.isSidebarOpen; 
  }
  
  closeMenu() { 
    this.isMenuOpen = false; 
  }
  
  closeSidebar() { 
    this.isSidebarOpen = false; 
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.cartApi.clear();
    
    this.isLoggedIn = false;
    this.userName = '';
    this.isAdmin = false;
    this.cartCount = 0;
    
    this.router.navigate(['/login']).then(() => {
      window.location.href = '/login';
    });
  }
}