// src/app/features/categories/components/category-details/category-details.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBar } from '../../../../shared/components/nav-bar/nav-bar';
import { Footer } from '../../../../shared/components/footer/footer';
import { CategoriesApi } from '../../services/categories-api';
import { Category } from '../../models';
import { ProductData } from '../../../products/models/product-data';
import { CartService as CartApi } from '../../../cart/services/cart-api';

@Component({
  selector: 'bajaj-category-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBar, Footer],
  templateUrl: './category-details.html',
  styleUrl: './category-details.css'
})
export class CategoryDetails implements OnInit {
  private _categoriesApi = inject(CategoriesApi);
  private cartApi = inject(CartApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected categoryId!: string;
  protected category: Category | null = null;
  protected products: ProductData[] = [];
  protected isLoading = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.loadCategoryDetails();
    });
  }

  private loadCategoryDetails(): void {
    this.isLoading = true;
    this._categoriesApi.getCategoryById(this.categoryId).subscribe({
      next: (res) => {
        this.category = res.data;
        this._categoriesApi.getProductsByCategory(this.categoryId).subscribe({
          next: (prodRes) => {
            this.products = Array.isArray(prodRes) ? prodRes : 
                           (prodRes?.products || prodRes?.data || []);
            this.isLoading = false;
          },
          error: () => this.isLoading = false
        });
      },
      error: () => this.isLoading = false
    });
  }

  protected addToCart(product: ProductData): void {
    if (!product._id) return;

    const discountedPrice = product.discount
      ? product.price - (product.price * product.discount / 100)
      : product.price;

    this.cartApi.addItem({
      productId: product._id,
      name: product.name,
      price: discountedPrice,
      image: product.images?.[0] || 'https://via.placeholder.com/150',
      originalPrice: product.price
    });

    alert(`${product.name} added to cart!`);
  }

  protected buyNow(product: ProductData): void {
    if (!product._id) return;

    this.addToCart(product);

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