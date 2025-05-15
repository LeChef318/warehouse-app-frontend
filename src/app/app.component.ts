import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeycloakService } from './services/auth/keycloak.service';
import { RouteTrackerService } from './services/route-tracker.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private keycloakService = inject(KeycloakService);
  loading = true;
  constructor(private routeTracker: RouteTrackerService) {
  }
  
  async ngOnInit(): Promise<void> {
    try {
      await this.keycloakService.init();
      console.log('Keycloak initialized successfully');
    } catch (error) {
      console.error('Error initializing Keycloak', error);
    } finally {
      this.loading = false;
    }
  }
}

