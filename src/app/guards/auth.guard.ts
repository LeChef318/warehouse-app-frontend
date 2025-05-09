// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/auth/keycloak.service';

export const authGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  
  // Check if the user is authenticated
  if (keycloakService.isAuthenticated()) {
    return true;
  }
  
  // If not authenticated, try to refresh the token
  return keycloakService.updateToken().then(refreshed => {
    if (refreshed) {
      return true;
    } else if (keycloakService.isAuthenticated()) {
      return true;
    } else {
      // If still not authenticated, redirect to login
      router.navigate(['/login']);
      return false;
    }
  }).catch(() => {
    router.navigate(['/login']);
    return false;
  });
};