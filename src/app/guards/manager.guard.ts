// src/app/guards/manager.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/auth/keycloak.service';

export const managerGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  
  if (keycloakService.isManager()) {
    return true;
  }
  
  // Redirect to access-denied page with a custom message
  console.log('Redirecting to access-denied');
  router.navigate(['/access-denied'], { 
    state: { message: 'You need manager permissions to access this page.' }
  });
  
  return false;
};