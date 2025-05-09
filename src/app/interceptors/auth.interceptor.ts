// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from '../services/auth/keycloak.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  
  // Only add the token for API requests, not for Keycloak auth requests
  if (req.url.includes('/api/')) {
    // Use refreshToken to ensure we have a valid token
    return from(keycloakService.refreshToken()).pipe(
      switchMap(token => {
        if (token) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next(authReq);
        }
        return next(req);
      })
    );
  }
  
  return next(req);
};