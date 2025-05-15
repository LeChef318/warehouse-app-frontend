// src/app/components/categories/category-list/category-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private keycloakService = inject(KeycloakService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  loading = true;
  error: string | null = null;
  isManager = false;
  
  // For search and filtering
  searchTerm = '';
  
  // For sorting
  sortedData: Category[] = [];
  
  // For pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  pageIndex = 0;
  
  ngOnInit(): void {
    this.isManager = this.keycloakService.isManager();
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
        this.sortedData = [...this.filteredCategories];
        this.applyPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  applyFilter(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(searchTermLower)
    );
    
    this.sortedData = [...this.filteredCategories];
    this.pageIndex = 0;
    this.applyPagination();
  }
  
  sortData(sort: Sort): void {
    const data = [...this.filteredCategories];
    
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.applyPagination();
      return;
    }
    
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        default: return 0;
      }
    });
    
    this.applyPagination();
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.applyPagination();
  }
  
  applyPagination(): void {
    // This would normally be done on the server side
    // For client-side, we're just slicing the data
  }
  
  createCategory(): void {
    if (this.isManager) {
      this.router.navigate(['/categories/create']);
    } else {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to create categories.' }
      });
    }
  }
  
  editCategory(id: number, event: Event): void {
    event.stopPropagation();
    
    if (this.isManager) {
      this.router.navigate(['/categories', id, 'edit']);
    } else {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to edit categories.' }
      });
    }
  }
  
  deleteCategory(id: number, event: Event): void {
    event.stopPropagation();
    
    if (!this.isManager) {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to delete categories.' }
      });
      return;
    }
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this category? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.snackBar.open('Category deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error deleting category:', err);
            this.snackBar.open('Failed to delete category. It may be in use by products.', 'Close', {
              duration: 5000
            });
          }
        });
      }
    });
  }
}