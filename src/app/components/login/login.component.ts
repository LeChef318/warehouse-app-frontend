import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeycloakService } from '../../services/auth/keycloak.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);
  loading = false;

  ngOnInit(): void {
    // If already authenticated, redirect to dashboard
    this.keycloakService.isAuthenticated().subscribe(authenticated => {
      if (authenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  login(): void {
    this.loading = true;
    this.keycloakService.login();
    // Note: Loading state will be handled by the redirect
  }
}