// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { KeycloakService } from '../services/auth/keycloak.service';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

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
    return this.keycloakService.isAuthenticated().pipe(
      switchMap(authenticated => {
        if (authenticated) {
          return of(true);
        }
        return from(this.keycloakService.refreshToken()).pipe(
          map(refreshed => {
            if (refreshed) {
              return true;
            }
            return this.router.createUrlTree(['/login']);
          }),
          catchError(() => of(this.router.createUrlTree(['/login'])))
        );
      })
    );
  }
}
