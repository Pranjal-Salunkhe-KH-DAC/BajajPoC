// src/app/features/categories/services/categories-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoriesApi {
  private _baseUrl = 'http://localhost:9090/api';
  private _http = inject(HttpClient);

  getCategories(): Observable<any> {
    return this._http.get<any>(`${this._baseUrl}/categories`);
  }

  getCategoryById(id: string): Observable<{ success: boolean; data: Category }> {
    return this.getCategories().pipe(
      map(res => {
        const categories = res.data || [];
        const category = categories.find((c: any) => c._id === id);
        return {
          success: !!category,
          data: category || { _id: id, name: 'Not Found', slug: '' }
        };
      })
    );
  }

  getProductsByCategory(categoryId: string): Observable<any> {
    return this._http.get<any>(`${this._baseUrl}/products?categoryId=${categoryId}`);
  }
}