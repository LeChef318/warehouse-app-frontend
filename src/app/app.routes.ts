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
import { authGuard } from './guards/auth.guard';
import { managerGuard } from './guards/manager.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
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
      { path: 'access-denied', component: AccessDeniedComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' }
];