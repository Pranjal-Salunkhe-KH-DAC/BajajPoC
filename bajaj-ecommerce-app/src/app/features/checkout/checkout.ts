// src/app/features/checkout/checkout.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService as CartApi, CartItem } from '../cart/services/cart-api';
import { OrderApi } from '../orders/services/order-api';
import { NavBar, Footer } from '../../shared/components';

@Component({
  selector: 'bajaj-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBar, Footer],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit, OnDestroy {
  private cartApi = inject(CartApi);
  private orderApi = inject(OrderApi);
  private router = inject(Router);
  private sub = new Subscription();

  protected cartItems: CartItem[] = [];
  protected subtotal = 0;
  protected shipping = 50;
  protected tax = 0;
  protected total = 0;
  protected isProcessing = false;

  protected shippingData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  };

  protected paymentMethod = 'cod';

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }

    console.log('Token found:', token);

    this.sub.add(
      this.cartApi.items$.subscribe((items: CartItem[]) => {
        this.cartItems = items;
        this.calculateTotals();
      })
    );

    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    console.log('Current user:', user);
    
    if (user.name) this.shippingData.fullName = user.name;
    if (user.email) this.shippingData.email = user.email;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private calculateTotals() {
    this.subtotal = this.cartApi.getTotal();
    this.tax = this.subtotal * 0.18;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  protected removeItem(id: string) {
    this.cartApi.remove(id);
  }

  protected placeOrder() {
    if (!this.validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Session expired. Please login again.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }

    this.isProcessing = true;

    const orderData = {
      items: this.cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress: this.shippingData,
      paymentMethod: this.paymentMethod,
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total
    };

    console.log('Placing order with data:', orderData);

    this.orderApi.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.cartApi.clear();
        
        // Extract order ID from different possible response structures
        let orderId = null;
        
        if (response.order?._id) {
          orderId = response.order._id;
        } else if (response.data?._id) {
          orderId = response.data._id;
        } else if (response._id) {
          orderId = response._id;
        }
        
        console.log('Extracted order ID:', orderId);
        
        alert('Order placed successfully!');
        
        // Navigate to orders list instead of order details
        // This is more reliable since we know orders list works
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        
        if (error.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('access_token');
          localStorage.removeItem('current_user');
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/checkout' }
          });
        } else if (error.status === 400) {
          alert(error.error?.message || 'Invalid order data. Please check your information.');
        } else {
          alert(error.error?.message || 'Failed to place order. Please try again.');
        }
        
        this.isProcessing = false;
      }
    });
  }

  private validateForm(): boolean {
    return !!(
      this.shippingData.fullName &&
      this.shippingData.email &&
      this.shippingData.phone &&
      this.shippingData.address &&
      this.shippingData.city &&
      this.shippingData.state &&
      this.shippingData.pincode
    );
  }
}