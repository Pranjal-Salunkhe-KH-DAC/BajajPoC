// src/app/features/products/services/products-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { ProductListResponse } from '../models/product-list-response';
import { ProductDetailsResponse } from '../models/product-details-response';

@Injectable({
  providedIn: 'root'
})
export class ProductsApi {
  private _baseUrl: string = "http://localhost:9090/api";
  private _httpClient = inject(HttpClient);

  getproducts(): Observable<ProductListResponse> {  // TYPED
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products`);  // FIXED: _httpClient + _baseUrl
  }

  getProductDetails(id: string): Observable<ProductDetailsResponse> {
    return this._httpClient.get<ProductDetailsResponse>(`${this._baseUrl}/products/${id}`);
  }
}