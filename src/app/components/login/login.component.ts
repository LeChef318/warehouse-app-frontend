import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KeycloakService } from '../../services/auth/keycloak.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  ngOnInit(): void {
    // If already authenticated, redirect to dashboard
    this.keycloakService.isAuthenticated().subscribe(authenticated => {
      if (authenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  login(): void {
    this.keycloakService.login();
  }
}