// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { KeycloakService } from '../services/auth/keycloak.service';
import { Observable, of } from 'rxjs';
import { switchMap, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkAuthentication();
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.checkAuthentication();
  }

  private checkAuthentication(): Observable<boolean | UrlTree> {
    return this.keycloakService.isInitializing().pipe(
      take(1),
      switchMap(initializing => {
        console.log('Auth guard - Initialization status:', initializing);
        if (initializing) {
          console.log('Auth guard - Waiting for Keycloak initialization...');
          return this.keycloakService.isInitializing().pipe(
            filter(init => !init),
            take(1),
            switchMap(() => this.checkAuthStatus())
          );
        }
        return this.checkAuthStatus();
      })
    );
  }

  private checkAuthStatus(): Observable<boolean | UrlTree> {
    return this.keycloakService.isAuthenticated().pipe(
      take(1),
      switchMap(authenticated => {
        console.log('Auth guard - Authentication status:', authenticated);
        if (authenticated) {
          console.log('Auth guard - User is authenticated, allowing access');
          return of(true);
        }
        
        console.log('Auth guard - User is not authenticated, redirecting to login');
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}
