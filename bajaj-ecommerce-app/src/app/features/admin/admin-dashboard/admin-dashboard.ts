import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar, Footer } from '../../../shared/components';

@Component({
  selector: 'bajaj-admin-dashboard',
  imports: [CommonModule, RouterLink, NavBar, Footer],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  protected stats = {
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  };
  protected isLoading = false;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Fetch dashboard data from admin service
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.stats = {
        totalSales: 125000,
        totalOrders: 450,
        totalUsers: 120,
        totalProducts: 250
      };
    }, 1500);
  }
}
