import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesApi } from '../../../features/categories/services/categories-api';
import { Category } from '../../../features/categories/models';

@Component({
  selector: 'bajaj-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider implements OnInit {
  private _categoriesApi = inject(CategoriesApi);
  protected categories: Category[] = [];
  protected isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    this._categoriesApi.getCategories().subscribe({
      next: (response) => {
        let data: Category[] = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && 'categories' in response && Array.isArray(response.categories)) {
          data = response.categories;
        } else if (response && 'data' in response && Array.isArray(response.data)) {
          data = response.data;
        }
        this.categories = data.slice(0, 6);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // Map category name → Bootstrap icon class
  protected getCategoryIcon(name: string): string {
    const map: { [key: string]: string } = {
      'electronics': 'bi bi-laptop',
      'fashion': 'bi bi-bag-heart',
      'home': 'bi bi-house-door',
      'kitchen': 'bi bi-cup-straw',
      'sports': 'bi bi-bicycle',
      'fitness': 'bi bi-heart-pulse',
      'beauty': 'bi bi-droplet',
      'health': 'bi bi-capsule',
      'books': 'bi bi-book',
      'stationery': 'bi bi-journal-text',
      'toys': 'bi bi-puzzle',
      'grocery': 'bi bi-basket'
    };

    const key = name.toLowerCase().replace(/[^a-z]/g, '');
    return map[key] || 'bi bi-grid-3x3-gap';
  }
}