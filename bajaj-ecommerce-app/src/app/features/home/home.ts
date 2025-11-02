import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsApi } from '../products/services/products-api';
import { ProductListResponse } from '../products/models/product-list-response';
import { NavBar, Footer, Slider, Banner } from '../../shared/components';

interface Category {
  name: string;
  slug: string;
}

@Component({
  selector: 'bajaj-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBar, Slider, Banner, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private _productsApi = inject(ProductsApi);
  protected featuredProducts!: ProductListResponse;
  protected loading = true;
  protected sidebarOpen = false;

  // Add this line
  protected currentYear = new Date().getFullYear();

  protected categories: Category[] = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Living', slug: 'home-living' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Toys', slug: 'toys' },
    { name: 'Grocery', slug: 'grocery' }
  ];

  ngOnInit(): void {
    this._productsApi.getproducts().subscribe({
      next: data => {
        this.featuredProducts = {
          ...data,
          data: data.data.filter(p => p.isFeatured).slice(0, 8)
        };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  closeSidebar() {
    this.sidebarOpen = false;
  }

  getFilledStars(rating: number): any[] {
    const count = Math.round(rating);
    return Array(count).fill(0);
  }
  getEmptyStars(rating: number): any[] {
    const filled = Math.round(rating);
    return Array(5 - filled).fill(0);
  }
}