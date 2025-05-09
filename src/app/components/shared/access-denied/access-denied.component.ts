import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent {
  private location = inject(Location);
  private router = inject(Router);
  
  message: string = history.state.message || 'You do not have permission to access this page.';
  
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/warehouses']);
    }
  }
  
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}