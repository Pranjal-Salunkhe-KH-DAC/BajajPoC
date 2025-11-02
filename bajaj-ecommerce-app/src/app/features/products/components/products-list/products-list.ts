// src/app/features/products/components/products-list/products-list.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavBar } from '../../../../shared/components/nav-bar/nav-bar';
import { Footer } from '../../../../shared/components/footer/footer';
import { ProductsApi } from '../../services/products-api';
import { ProductListResponse } from '../../models/product-list-response';
import { CartService as CartApi } from '../../../cart/services/cart-api';

@Component({
  selector: 'bajaj-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBar, Footer],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList implements OnInit {
  private productsApi = inject(ProductsApi);
  private cartApi = inject(CartApi);
  private router = inject(Router);

  protected product: ProductListResponse | null = null;
  protected title = 'All Products';
  protected isLoading = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productsApi.getproducts().subscribe({
      next: (res: ProductListResponse) => {
        this.product = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  protected addToCart(productItem: any): void {
    if (!productItem?._id) return;
    
    const discountedPrice = productItem.discount
      ? productItem.price - (productItem.price * productItem.discount / 100)
      : productItem.price;

    this.cartApi.addItem({
      productId: productItem._id,
      name: productItem.name,
      price: discountedPrice,
      image: productItem.images?.[0] || 'https://via.placeholder.com/150',
      originalPrice: productItem.price
    });
    
    alert(`${productItem.name} added to cart!`);
  }

  protected buyNow(productItem: any): void {
    if (!productItem?._id) return;
    
    this.addToCart(productItem);
    
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