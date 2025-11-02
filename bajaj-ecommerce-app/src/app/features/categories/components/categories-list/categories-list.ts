import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar, Footer } from '../../../../shared/components';
import { CategoriesApi } from '../../services/categories-api';
import { Category } from '../../models/category';

@Component({
  selector: 'bajaj-categories-list',
  imports: [CommonModule, RouterLink, NavBar, Footer],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css',
})
export class CategoriesList implements OnInit {
  private _categoriesApi = inject(CategoriesApi);
  protected categories: Category[] = [];
  protected isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    this._categoriesApi.getCategories().subscribe({
      next: (response) => {
        // Handle different response formats
        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response && response.categories && Array.isArray(response.categories)) {
          this.categories = response.categories;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data;
        } else {
          this.categories = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.isLoading = false;
      }
    });
  }
}
