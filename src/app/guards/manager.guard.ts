// src/app/guards/manager.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from '../services/auth/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.keycloakService.isManager()) {
      return true;
    }
    
    this.keycloakService.redirectToAccessDenied('You need manager permissions to access this page.');
    return false;
  }
}