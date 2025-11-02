// src/app/shared/guards/admin.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  static activate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }
    
    // Check if user has admin role
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    if (user.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      router.navigate(['/home']);
      return false;
    }
    
    return true;
  };
}