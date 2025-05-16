import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteTrackerService {
  private readonly STORAGE_KEY = 'lastRoute';
  private readonly EXCLUDED_ROUTES = [
    '/login',
    '/access-denied',
    '/products/create',
    '/products/:id/edit',
    '/categories/create',
    '/categories/:id/edit',
    '/warehouses/create',
    '/warehouses/:id/edit'
  ];

  constructor(private router: Router) {
    this.trackRoutes();
  }

  private trackRoutes(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        const url = event.url;
        // Only save routes that are not in the excluded list
        if (!this.isExcludedRoute(url)) {
          sessionStorage.setItem(this.STORAGE_KEY, url);
        }
      });
  }

  private isExcludedRoute(url: string): boolean {
    return this.EXCLUDED_ROUTES.some(route => {
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(url);
    });
  }

  public getLastRoute(): string | null {
    return sessionStorage.getItem(this.STORAGE_KEY);
  }

  public clearLastRoute(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
