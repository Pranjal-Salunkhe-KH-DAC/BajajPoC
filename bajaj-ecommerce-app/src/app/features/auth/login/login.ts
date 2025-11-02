// src/app/features/auth/login/login.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavBar } from '../../../shared/components/nav-bar/nav-bar';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'bajaj-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavBar, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private apiUrl = 'http://localhost:9090/api';

  protected loginData = {
    email: '',
    password: ''
  };

  protected isLoading = false;
  protected errorMessage = '';
  private returnUrl = '/home';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/home';
    });

    const token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate([this.returnUrl]);
    }
  }

  protected onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>(`${this.apiUrl}/auth/login`, this.loginData)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          
          const token = response.token || response.access_token || response.data?.token;
          const userData = response.user || response.data?.user || response.data || {};
          
          if (!token) {
            this.errorMessage = 'Invalid response from server';
            this.isLoading = false;
            return;
          }
          
          localStorage.setItem('access_token', token);
          localStorage.setItem('current_user', JSON.stringify(userData));
          
          console.log('Stored user:', userData);
          
          if (userData.role === 'admin') {
            this.router.navigate(['/admin/admin-dashboard']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = error.error?.message || error.message || 'Login failed. Please check your credentials.';
          this.isLoading = false;
        }
      });
  }
}