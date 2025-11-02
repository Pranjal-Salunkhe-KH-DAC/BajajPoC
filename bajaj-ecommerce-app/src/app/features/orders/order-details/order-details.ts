// src/app/features/orders/order-details/order-details.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavBar } from '../../../shared/components/nav-bar/nav-bar';
import { Footer } from '../../../shared/components/footer/footer';

const API_BASE = 'http://localhost:9090/api';

@Component({
  selector: 'bajaj-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBar, Footer],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  protected order: any = null;
  protected isLoading = true;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      return;
    }

    // Use type checking to ensure 'id' is treated as a string or number
    const orderId = id; 

    this.http.get(`${API_BASE}/orders/${orderId}`, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        console.log('Order details response:', res);
        this.order = res.order || res.data || res;
        this.isLoading = false;
      },
      error: (err) => {
        // Log the full error to help debug the HttpErrorResponse
        console.error('Failed to fetch order details:', err); 
        // Important: Set order to null to display the "Order Not Found" block
        this.order = null; 
        this.isLoading = false;
      }
    });
  }

  /**
   * TrackBy function for Order Items to prevent NG0955 duplicated keys error.
   * Prioritizes _id, then productId, then falls back to a combined key using $index.
   */
  trackByItem(index: number, item: any): any {
      return item._id || item.productId || index;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'warning',
      Processing: 'info',
      Shipped: 'primary',
      Delivered: 'success',
      Cancelled: 'danger'
    };
    return `badge bg-${map[status] || 'secondary'} text-white px-3 py-1`;
  }
}