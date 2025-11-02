import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bajaj-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner implements OnInit {
  protected slides = [
    {
      title: 'Welcome to Bajaj Store',
      subtitle: 'Discover Amazing Products',
      description: 'Your one-stop shop for quality products',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=400&fit=crop',
      link: '/products'
    },
    {
      title: 'Special Offers',
      subtitle: 'Up to 50% OFF',
      description: 'Limited time deals on selected products',
      image: 'https://images.unsplash.com/photo-1556761229-1e6c1ceb37d3?w=1200&h=400&fit=crop',
      link: '/products'
    },
    {
      title: 'New Arrivals',
      subtitle: 'Latest Products',
      description: 'Check out our newest collection',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&h=400&fit=crop',
      link: '/products'
    }
  ];

  ngOnInit(): void {
    // Bootstrap auto-initializes via data-bs-ride="carousel"
    // No manual interval needed
  }
}