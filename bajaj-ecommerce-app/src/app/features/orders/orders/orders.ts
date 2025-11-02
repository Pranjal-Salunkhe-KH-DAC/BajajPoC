// src/app/features/orders/orders.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavBar, Footer } from '../../../shared/components';

const API_BASE = 'http://localhost:9090/api';

@Component({
  selector: 'bajaj-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBar, Footer],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  private http = inject(HttpClient);
  protected orders: any[] = [];
  protected isLoading = true;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit() {
    this.http.get(`${API_BASE}/orders`, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        console.log('Orders response:', res); // Debug log
        
        // Handle different response structures
        this.orders = res.orders || res.data || res || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'warning',
      Processing: 'info',
      Shipped: 'primary',
      Delivered: 'success',
      Cancelled: 'danger'
    };
    return `badge bg-${map[status] || 'secondary'} text-white px-2 py-1`;
  }
}