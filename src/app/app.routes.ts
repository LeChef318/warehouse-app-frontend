// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WarehouseListComponent } from './components/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseDetailComponent } from './components/warehouses/warehouse-detail/warehouse-detail.component';
import { WarehouseCreateComponent } from './components/warehouses/warehouse-create/warehouse-create.component';
import { WarehouseEditComponent } from './components/warehouses/warehouse-edit/warehouse-edit.component';
import { AccessDeniedComponent } from './components/shared/access-denied/access-denied.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { managerGuard } from './guards/manager.guard';
import { ProductListComponent } from './components/products/product-list/product-list.component';
// import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
// import { ProductCreateComponent } from './components/products/product-create/product-create.component';
// import { ProductEditComponent } from './components/products/product-edit/product-edit.component';
// import { CategoryListComponent } from './components/categories/category-list/category-list.component';
// import { CategoryCreateComponent } from './components/categories/category-create/category-create.component';
// import { CategoryEditComponent } from './components/categories/category-edit/category-edit.component';

export const routes: Routes = [
  { 
    path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      // Warehouse routes
      { path: 'warehouses', component: WarehouseListComponent },
      { 
        path: 'warehouses/create', 
        component: WarehouseCreateComponent,
        canActivate: [managerGuard]
      },
      { path: 'warehouses/:id', component: WarehouseDetailComponent },
      { 
        path: 'warehouses/:id/edit', 
        component: WarehouseEditComponent,
        canActivate: [managerGuard]
      },
      
      // Product routes
      { path: 'products', component: ProductListComponent },
      // { 
      //   path: 'products/create', 
      //   component: ProductCreateComponent,
      //   canActivate: [managerGuard]
      // },
      // { path: 'products/:id', component: ProductDetailComponent },
      // { 
      //   path: 'products/:id/edit', 
      //   component: ProductEditComponent,
      //   canActivate: [managerGuard]
      // },
      
      // Category routes - uncomment when components are created
      // { path: 'categories', component: CategoryListComponent },
      // { 
      //   path: 'categories/create', 
      //   component: CategoryCreateComponent,
      //   canActivate: [managerGuard]
      // },
      // { 
      //   path: 'categories/:id/edit', 
      //   component: CategoryEditComponent,
      //   canActivate: [managerGuard]
      // },
      
      { path: 'access-denied', component: AccessDeniedComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/dashboard' }
];