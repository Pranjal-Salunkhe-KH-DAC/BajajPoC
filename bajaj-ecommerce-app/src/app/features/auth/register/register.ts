// src/app/features/auth/register/register.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavBar } from '../../../shared/components/nav-bar/nav-bar';
import { Footer } from '../../../shared/components/footer/footer';

const API_BASE = 'http://localhost:9090/api';

@Component({
  selector: 'bajaj-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavBar, Footer],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  protected registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-]{10,15}$/)]],
  });

  protected isSubmitting = false;
  protected authErrorMessage = '';
  protected successMessage = '';

  protected passwordsMatch(): boolean {
    const p = this.registerForm.get('password')?.value;
    const cp = this.registerForm.get('confirmPassword')?.value;
    return p === cp && p !== '';
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid || !this.passwordsMatch()) return;

    this.isSubmitting = true;
    this.authErrorMessage = '';
    this.successMessage = '';

    const { confirmPassword, ...payload } = this.registerForm.getRawValue() as any;

    this.http.post<any>(`${API_BASE}/auth/register`, payload)
      .subscribe({
        next: (response) => {
          const token = response.token || response.access_token;
          const user = response.user || response.data;
          
          localStorage.setItem('access_token', token);
          localStorage.setItem('current_user', JSON.stringify(user));
          this.successMessage = 'Account created! Redirecting...';
          setTimeout(() => this.router.navigate(['/home']), 1500);
        },
        error: (err: any) => {
          this.authErrorMessage = err?.error?.message || 'Registration failed. Try again.';
          this.isSubmitting = false;
        },
        complete: () => (this.isSubmitting = false),
      });
  }
}