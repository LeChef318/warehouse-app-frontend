// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ManagerGuard } from './guards/manager.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/user-registration/user-registration.component').then(m => m.UserRegistrationComponent) },
  { 
    path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent), canActivate: [ManagerGuard] },
      { path: 'warehouses', loadComponent: () => import('./components/warehouses/warehouse-list/warehouse-list.component').then(m => m.WarehouseListComponent) },
      { path: 'warehouses/create', loadComponent: () => import('./components/warehouses/warehouse-create/warehouse-create.component').then(m => m.WarehouseCreateComponent), canActivate: [ManagerGuard] },
      { path: 'warehouses/:id', loadComponent: () => import('./components/warehouses/warehouse-detail/warehouse-detail.component').then(m => m.WarehouseDetailComponent) },
      { path: 'warehouses/:id/edit', loadComponent: () => import('./components/warehouses/warehouse-edit/warehouse-edit.component').then(m => m.WarehouseEditComponent), canActivate: [ManagerGuard] },
      { path: 'products', loadComponent: () => import('./components/products/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'products/create', loadComponent: () => import('./components/products/product-create/product-create.component').then(m => m.ProductCreateComponent), canActivate: [ManagerGuard] },
      { path: 'products/:id', loadComponent: () => import('./components/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
      { path: 'products/:id/edit', loadComponent: () => import('./components/products/product-edit/product-edit.component').then(m => m.ProductEditComponent), canActivate: [ManagerGuard] },
      { path: 'categories', loadComponent: () => import('./components/categories/category-list/category-list.component').then(m => m.CategoryListComponent) },
      { path: 'categories/create', loadComponent: () => import('./components/categories/category-create/category-create.component').then(m => m.CategoryCreateComponent), canActivate: [ManagerGuard] },
      { path: 'categories/:id/edit', loadComponent: () => import('./components/categories/category-edit/category-edit.component').then(m => m.CategoryEditComponent), canActivate: [ManagerGuard] },
      { path: 'access-denied', loadComponent: () => import('./components/shared/access-denied/access-denied.component').then(m => m.AccessDeniedComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];