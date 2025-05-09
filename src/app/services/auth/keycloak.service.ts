import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import Keycloak from 'keycloak-js';
import { keycloakConfig } from '../../config/keycloak.config';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak | undefined;
  private authenticated = new BehaviorSubject<boolean>(false);
  private initializing = new BehaviorSubject<boolean>(true);
  private router = inject(Router);

  public async init(): Promise<boolean> {
    try {
      this.keycloak = new Keycloak(keycloakConfig);
      
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false
      });
      
      this.authenticated.next(authenticated);
      
      if (authenticated) {
        this.setupTokenRefresh();
      }
      
      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak', error);
      return false;
    } finally {
      this.initializing.next(false);
    }
  }

  public login(): void {
    if (this.keycloak) {
      this.keycloak.login();
    }
  }

  public logout(): void {
    if (this.keycloak) {
      this.keycloak.logout({ redirectUri: window.location.origin + '/login' });
    }
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  public isInitializing(): Observable<boolean> {
    return this.initializing.asObservable();
  }

  public getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.keycloak && this.keycloak.token) {
        this.keycloak.updateToken(30)
          .then(() => {
            resolve(this.keycloak!.token as string);
          })
          .catch(() => {
            this.login();
            reject('Failed to refresh token');
          });
      } else {
        reject('Not logged in');
      }
    });
  }

  public getUserInfo(): any {
    if (this.keycloak && this.keycloak.tokenParsed) {
      return this.keycloak.tokenParsed;
    }
    return null;
  }

  private setupTokenRefresh(): void {
    if (this.keycloak) {
      this.keycloak.onTokenExpired = () => {
        this.keycloak?.updateToken(30).catch(() => {
          this.logout();
        });
      };
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshed = await this.keycloak?.updateToken(30);
      if (refreshed) {
        console.log('Token refreshed');
      }
      return this.keycloak?.token as string || '';
    } catch (error) {
      console.error('Failed to refresh token', error);
      this.keycloak?.login();
      return '';
    }
  }

  getUserRoles(): string[] {
    if (this.keycloak && this.keycloak.authenticated) {
      const realmRoles = this.keycloak.realmAccess?.roles || [];
      return realmRoles;
    }
    return [];
  }
  
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
  
  isManager(): boolean {
    return this.hasRole('MANAGER');
  }

  redirectToAccessDenied(message: string = 'You do not have permission to access this page.'): void {
    const router = inject(Router);
    router.navigateByUrl('/access-denied', { 
      state: { message }
    });
  }
}