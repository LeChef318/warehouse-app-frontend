import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { KeycloakService } from '../../../services/auth/keycloak.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private keycloakService = inject(KeycloakService);
  
  @Output() toggleSidebar = new EventEmitter<void>();
  
  pageTitle: string = 'Dashboard';
  userInfo: any = null;
  username: string = '';
  
  ngOnInit(): void {
    // Get user info
    this.userInfo = this.keycloakService.getUserInfo();
    if (this.userInfo) {
      this.username = this.userInfo.name || 
                      this.userInfo.preferred_username || 
                      'User';
    }
    
    // Update page title based on route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.url;
      if (currentRoute.includes('/dashboard')) {
        this.pageTitle = 'Dashboard';
      } else if (currentRoute.includes('/warehouses')) {
        this.pageTitle = 'Warehouses';
      } else {
        this.pageTitle = 'Warehouse Management';
      }
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
  
  logout(): void {
    this.keycloakService.logout();
  }
}