// src/app/features/products/components/product-details/product-details.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavBar, Footer } from '../../../../shared/components';
import { ProductsApi } from '../../services/products-api';
import { ProductData } from '../../models/product-data';
import { CartService as CartApi } from '../../../cart/services/cart-api';

@Component({
  selector: 'bajaj-product-details',
  standalone: true,
  imports: [CommonModule, NavBar, Footer],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private productsApi = inject(ProductsApi);
  private cartApi = inject(CartApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected product: ProductData | null = null;
  protected isLoading = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) this.loadProduct(id);
    });
  }

  private loadProduct(id: string): void {
    this.isLoading = true;

    this.productsApi.getproducts().subscribe({
      next: (res: any) => {
        // Handle different response structures
        const products: ProductData[] = Array.isArray(res) 
          ? res 
          : (res?.data || res?.products || []);

        this.product = products.find(p => p._id === id) || null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load product error:', err);
        this.isLoading = false;
      }
    });
  }

  protected addToCart(): void {
    if (!this.product?._id) return;

    const discountedPrice = this.product.discount 
      ? this.product.price - (this.product.price * this.product.discount / 100)
      : this.product.price;

    this.cartApi.addItem({
      productId: this.product._id,
      name: this.product.name,
      price: discountedPrice,
      image: this.product.images?.[0] || 'https://via.placeholder.com/150',
      originalPrice: this.product.price
    });

    alert(`${this.product.name} added to cart!`);
  }

  protected buyNow(): void {
    if (!this.product) return;
    
    this.addToCart();

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