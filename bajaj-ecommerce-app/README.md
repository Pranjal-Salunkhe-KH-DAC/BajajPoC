# Bajaj eCommerce Application

A modern, fully-featured e-commerce application built with Angular, featuring a responsive design with mobile-first approach and hamburger menu navigation.

## 🚀 Features

### Core Functionality
- **Product Management**: Browse and view detailed product information
- **Category Management**: Navigate products by categories
- **Shopping Cart**: Add products to cart for checkout
- **Order Management**: Track and view order history
- **User Authentication**: Login and registration system
- **Admin Dashboard**: Comprehensive admin panel for managing the store
- **Responsive Design**: Mobile-first design with hamburger menu
- **Beautiful UI**: Modern, professional interface using Bootstrap 5

### Special Features
- **Mobile Sidebar**: Hamburger menu that slides in from the left on mobile devices
- **Desktop Navigation**: Full navigation menu on desktop screens
- **Homepage Carousel**: Attractive banner carousel with rotating slides
- **Category Slider**: Quick access to product categories
- **Product Grid**: Beautiful product cards with hover effects
- **Loading States**: Spinner animations for better UX

## 📁 Project Structure

```
src/app/
├── app.ts                      # Root component with router
├── app.config.ts              # Application configuration
├── app.routes.ts              # Route definitions
├── features/
│   ├── auth/                  # Authentication module
│   │   ├── login/
│   │   └── register/
│   ├── products/              # Products module
│   │   ├── components/
│   │   │   ├── products-list/
│   │   │   └── product-details/
│   │   ├── models/
│   │   └── services/
│   ├── categories/            # Categories module
│   ├── cart/                  # Shopping cart module
│   ├── orders/                # Orders module
│   ├── admin/                 # Admin dashboard
│   └── home/                  # Homepage
└── shared/
    └── components/
        ├── nav-bar/           # Navigation with hamburger menu
        ├── sidebar/           # Mobile sidebar
        ├── banner/            # Carousel banner
        ├── slider/            # Category slider
        └── footer/            # Site footer
```

## 🛣️ Routes

The application includes the following routes:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Redirects to homepage |
| `/home` | Home | Beautiful homepage with featured products |
| `/products` | Products List | View all products |
| `/product/:id` | Product Details | Detailed product view |
| `/categories` | Categories | Browse by categories |
| `/category/:id` | Category Details | Products in a category |
| `/login` | Login | User login page |
| `/register` | Register | User registration |
| `/cart` | Cart | Shopping cart |
| `/orders` | Orders | User's order history |
| `/order/:id` | Order Details | Detailed order view |
| `/admin` | Admin Dashboard | Admin panel |

## 📱 Responsive Design

### Mobile View (< 992px)
- Hamburger menu icon in the top-left corner
- Sidebar slides in from the left when hamburger is clicked
- Overlay background dims content
- Touch-friendly interface
- Full-width layouts

### Desktop View (≥ 992px)
- Full navigation menu in the navbar
- Category slider visible
- Multi-column product grids
- Enhanced hover effects

## 🎨 Components

### NavBar
- Sticky navigation bar
- Hamburger menu for mobile
- Dropdown for account management
- Search bar (desktop)
- Cart badge showing item count

### Sidebar
- Mobile-only component
- Slides in from left
- Contains all navigation links
- Overlay background
- Smooth animations

### Banner
- Image carousel with auto-slide
- Manual navigation controls
- Call-to-action buttons
- Beautiful captions

### Product Cards
- Image with hover effects
- Price and discount badges
- Quick view and add to cart
- Stock availability indicator
- Star ratings

## 🔧 Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

```bash
npm install
```

### Running the Application

```bash
ng serve
```

Navigate to `http://localhost:4200`

### Backend API

The application connects to a Node.js backend API running on `http://localhost:5000`

Make sure your backend is running with these endpoints:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - Get all categories
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/cart/add` - Add to cart
- `GET /api/cart` - Get cart
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders

### Building for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## 🎯 Key Features Implemented

✅ Complete routing system with lazy loading  
✅ Mobile-first responsive design  
✅ Hamburger menu with sidebar for mobile  
✅ Beautiful homepage with featured products  
✅ Product listing and details pages  
✅ Category browsing  
✅ Shopping cart interface  
✅ Order management  
✅ Login and registration forms  
✅ Admin dashboard  
✅ Bootstrap 5 integration  
✅ Bootstrap Icons  
✅ Loading states and animations  
✅ Modern UI/UX design  

## 📝 Notes

- The hamburger menu is a key feature that transforms into a sidebar on mobile devices
- All routes use Angular's lazy loading for optimal performance
- The application follows Angular standalone components pattern
- Bootstrap is loaded via CDN in the index.html
- Product data is fetched from the backend API

## 🏗️ Technical Stack

- **Frontend Framework**: Angular 20.3
- **UI Library**: Bootstrap 5.3
- **Icons**: Bootstrap Icons 1.11
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: Signals (Angular Signals)

## 👥 Team

Developed by Bajaj New Developers, Pune!

## 📄 License

This project is proprietary and confidential.
