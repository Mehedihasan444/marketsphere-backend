# MarketSphere - Multi-Vendor E-Commerce Platform

![MarketSphere](./marketsphere-frontend/src/assets/logo.webp)

## 📋 Table of Contents

- [Overview](#overview)
- [🚀 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🚀 Running the Application](#-running-the-application)
- [📚 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [👥 User Roles](#-user-roles)
- [🔐 Authentication](#-authentication)
- [🎨 UI/UX Features](#-uiux-features)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📄 License](#-license)

## Overview

MarketSphere is a comprehensive multi-vendor e-commerce platform that enables customers to shop from multiple vendors, vendors to manage their shops and products, and administrators to oversee the entire marketplace. Built with modern web technologies, it provides a scalable, secure, and user-friendly shopping experience.

### Key Highlights

- 🛍️ **Multi-Vendor Marketplace**: Support for multiple vendors with individual shop management
- 🔐 **Role-Based Access Control**: Admin, Vendor, and Customer roles with specific permissions
- 🛒 **Advanced Shopping Cart**: Smart cart management with vendor separation
- 💳 **Secure Payments**: Integrated payment processing with transaction management
- 📱 **Responsive Design**: Mobile-first approach with modern UI components
- 🔍 **Advanced Search & Filtering**: Comprehensive product discovery features
- ⭐ **Review & Rating System**: Customer feedback and rating functionality
- 📊 **Analytics Dashboard**: Comprehensive dashboards for all user roles

## 🚀 Features

### Customer Features
- Browse products from multiple vendors
- Advanced search and filtering (price, category, ratings, etc.)
- Shopping cart with vendor separation warnings
- Wishlist functionality
- Product comparison (up to 3 products)
- Order tracking and history
- Product reviews and ratings (post-purchase)
- Shop following system
- Recent products viewed
- Coupon code application
- Multiple payment options

### Vendor Features
- Shop creation and management
- Product management (CRUD operations)
- Inventory tracking
- Order management
- Sales analytics and dashboard
- Customer review monitoring
- Discount and promotion management
- Shop customization

### Admin Features
- User management (customers and vendors)
- Shop blacklisting and monitoring
- Category management
- Transaction oversight
- Platform analytics
- Content moderation
- System configuration

## 🏗️ Architecture

MarketSphere follows a modern full-stack architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - React 18      │    │ - Express.js    │    │ - Prisma ORM    │
│ - TypeScript    │    │ - TypeScript    │    │ - Migrations    │
│ - Redux Toolkit │    │ - JWT Auth      │    │ - Seeding       │
│ - Ant Design    │    │ - Cloudinary    │    │                 │
│ - Tailwind CSS  │    │ - Nodemailer    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Validation**: Zod
- **Security**: bcryptjs, CORS, Cookie Parser

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Ant Design
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Image Gallery**: React Image Gallery
- **Icons**: Lucide React, React Icons

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database Management**: Prisma CLI
- **Development Server**: ts-node-dev (backend), Vite (frontend)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Cloudinary account (for image storage)

### Clone the Repository
```bash
git clone <repository-url>
cd marketsphere
```

### Backend Setup
```bash
cd marketsphere-backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your configuration

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run dev
```

### Frontend Setup
```bash
cd marketsphere-frontend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your configuration

# Start development server
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `marketsphere-backend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/marketsphere"

# JWT
JWT_ACCESS_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
NODE_ENV="development"
PORT=5000
CLIENT_URL="http://localhost:5173"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Admin Credentials (for seeding)
ADMIN_EMAIL="admin@marketsphere.com"
ADMIN_PASS="admin123"
```

### Frontend Environment Variables
Create a `.env` file in the `marketsphere-frontend` directory:

```env
VITE_SERVER_URL="http://localhost:5000/api/v1"
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**:
```bash
cd marketsphere-backend
npm run dev
```
The backend server will start on `http://localhost:5000`

2. **Start the Frontend Development Server**:
```bash
cd marketsphere-frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Production Build

1. **Build the Frontend**:
```bash
cd marketsphere-frontend
npm run build
```

2. **Build the Backend**:
```bash
cd marketsphere-backend
npm run build
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - User logout
- `POST /auth/change-password` - Change password
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/profile` - Delete user account

### Product Endpoints
- `GET /products` - Get all products (with pagination and filters)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (Vendor only)
- `PUT /products/:id` - Update product (Vendor only)
- `DELETE /products/:id` - Delete product (Vendor only)

### Shop Management
- `GET /shops` - Get all shops
- `GET /shops/:id` - Get shop by ID
- `POST /shops` - Create shop (Vendor only)
- `PUT /shops/:id` - Update shop (Vendor only)
- `DELETE /shops/:id` - Delete shop (Admin only)

### Order Management
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status (Vendor/Admin)

### Cart Operations
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove` - Remove item from cart
- `DELETE /cart/clear` - Clear entire cart

### Review System
- `GET /reviews/product/:productId` - Get product reviews
- `POST /reviews` - Create review (Customer only)
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Admin Endpoints
- `GET /admins/users` - Get all users
- `PUT /admins/users/:id/status` - Update user status
- `GET /admins/shops` - Get all shops
- `PUT /admins/shops/:id/blacklist` - Blacklist shop
- `GET /admins/analytics` - Get platform analytics

For detailed API documentation with request/response schemas, see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

### Core Models
- **User**: Base user entity with role-based access
- **Admin**: Administrator accounts
- **Customer**: Customer accounts and profiles
- **Vendor**: Vendor accounts and shop management
- **Shop**: Vendor shops with products and settings
- **Product**: Product catalog with categories and inventory
- **Category**: Product categorization system

### E-commerce Models
- **Cart**: Shopping cart functionality
- **Order**: Order management and tracking
- **Payment**: Payment processing and records
- **Transaction**: Financial transaction logs
- **Coupon**: Discount and promotional codes
- **Review**: Product reviews and ratings

### Additional Features
- **Wishlist**: Customer wishlists
- **Follow**: Shop following system
- **FlashSale**: Time-limited promotions
- **RecentProduct**: Recently viewed products tracking

For detailed schema documentation, see [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)

## 👥 User Roles

### Admin
- **Permissions**: Full platform control
- **Capabilities**:
  - User management (suspend/delete accounts)
  - Shop management (blacklist shops)
  - Category management
  - Transaction monitoring
  - Platform analytics
  - Content moderation

### Vendor
- **Permissions**: Shop and product management
- **Capabilities**:
  - Create and manage shop
  - Product CRUD operations
  - Inventory management
  - Order processing
  - Customer communication
  - Sales analytics

### Customer
- **Permissions**: Shopping and account management
- **Capabilities**:
  - Browse and search products
  - Cart and wishlist management
  - Place and track orders
  - Write product reviews
  - Follow shops
  - Account management

## 🔐 Authentication

MarketSphere uses JWT-based authentication with the following features:

- **Access Tokens**: Short-lived tokens for API access (1 day)
- **Refresh Tokens**: Long-lived tokens for token renewal (7 days)
- **Role-Based Access**: Different permissions for Admin, Vendor, and Customer
- **Password Security**: bcrypt hashing with salt rounds
- **Email Verification**: Account verification via email
- **Password Reset**: Secure password reset functionality

### Authentication Flow
1. User registers/logs in with credentials
2. Server validates credentials and returns JWT tokens
3. Client stores tokens securely
4. Protected routes require valid access token
5. Refresh token used to renew expired access tokens

## 🎨 UI/UX Features

### Design System
- **Component Library**: Ant Design for consistent UI components
- **Styling**: Tailwind CSS for custom styling and responsive design
- **Typography**: System fonts with fallbacks
- **Color Scheme**: Professional e-commerce color palette
- **Icons**: Lucide React and React Icons for comprehensive iconography

### User Experience
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Navigation**: Intuitive menu structure
- **Search**: Real-time search with suggestions
- **Pagination**: Infinite scroll and traditional pagination
- **Animations**: Smooth transitions with Framer Motion

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd marketsphere-backend
npm test

# Frontend tests
cd marketsphere-frontend
npm test
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

## 🚀 Deployment

### Backend Deployment (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`

### Frontend Deployment (Vercel)
1. Build the project: `npm run build`
2. Deploy: `vercel --prod`

### Database Deployment
- **Production**: Use managed PostgreSQL (e.g., Railway, Supabase, AWS RDS)
- **Migrations**: Run `npx prisma migrate deploy` in production

### Environment Variables
Ensure all production environment variables are configured in your deployment platform.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📞 Support

For support, email support@marketsphere.com or join our [Discord community](https://discord.gg/marketsphere).

---

**Built with ❤️ by the MarketSphere Team**
