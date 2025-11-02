// src/app/features/orders/services/order-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrderApi {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:9090/api';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    console.log('Token for order request:', token);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createOrder(orderData: CreateOrderRequest): Observable<any> {
    console.log('Creating order with data:', orderData);
    console.log('Headers:', this.getHeaders());
    return this.http.post(`${this.apiUrl}/orders`, orderData, {
      headers: this.getHeaders()
    });
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, {
      headers: this.getHeaders()
    });
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}`, {
      headers: this.getHeaders()
    });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/status`, 
      { status },
      { headers: this.getHeaders() }
    );
  }
}