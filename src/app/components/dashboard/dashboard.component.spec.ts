import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { KeycloakService } from '../../services/auth/keycloak.service';
import { WarehouseService } from '../../services/warehouse.service';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Warehouse } from '../../models/warehouse.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let keycloakServiceSpy: jasmine.SpyObj<KeycloakService>;
  let warehouseServiceSpy: jasmine.SpyObj<WarehouseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUserInfo = {
    name: 'Test User',
    email: 'test@example.com',
    preferred_username: 'testuser'
  };

  const mockWarehouses: Warehouse[] = [
    {
      id: '1',
      name: 'Warehouse 1',
      location: 'Location 1',
      stocks: [
        { id: 1, productId: 1, productName: 'Product 1', quantity: 10 },
        { id: 2, productId: 2, productName: 'Product 2', quantity: 20 }
      ]
    },
    {
      id: '2',
      name: 'Warehouse 2',
      location: 'Location 2',
      stocks: [
        { id: 3, productId: 3, productName: 'Product 3', quantity: 30 }
      ]
    }
  ];

  beforeEach(async () => {
    const keycloakSpy = jasmine.createSpyObj('KeycloakService', ['getUserInfo', 'getUserRoles']);
    const warehouseSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouses']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Set up default spy behavior
    warehouseSpy.getWarehouses.and.returnValue(of(mockWarehouses));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: KeycloakService, useValue: keycloakSpy },
        { provide: WarehouseService, useValue: warehouseSpy },
        { provide: ProductService, useValue: {} },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    keycloakServiceSpy = TestBed.inject(KeycloakService) as jasmine.SpyObj<KeycloakService>;
    warehouseServiceSpy = TestBed.inject(WarehouseService) as jasmine.SpyObj<WarehouseService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user info and set manager status on init', () => {
    keycloakServiceSpy.getUserInfo.and.returnValue(mockUserInfo);
    keycloakServiceSpy.getUserRoles.and.returnValue(['manager']);
    warehouseServiceSpy.getWarehouses.and.returnValue(of(mockWarehouses));

    component.ngOnInit();

    expect(component.userInfo).toEqual(mockUserInfo);
    expect(component.isManager).toBeTrue();
    expect(component.warehouses).toEqual(mockWarehouses);
  });

  it('should load warehouses and calculate stats successfully', () => {
    warehouseServiceSpy.getWarehouses.and.returnValue(of(mockWarehouses));

    component.loadWarehouses();

    expect(component.warehouses).toEqual(mockWarehouses);
    expect(component.warehouseCount).toBe(2);
    expect(component.productCount).toBe(3);
    expect(component.totalStock).toBe(60);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle warehouse loading error', () => {
    warehouseServiceSpy.getWarehouses.and.returnValue(throwError(() => new Error('Failed to load')));

    component.loadWarehouses();

    expect(component.error).toBe('Failed to load warehouses. Please try again.');
    expect(component.loading).toBeFalse();
  });

  it('should calculate product count for a warehouse', () => {
    const warehouse = mockWarehouses[0];
    expect(component.getProductCount(warehouse)).toBe(2);
  });

  it('should calculate total quantity for a warehouse', () => {
    const warehouse = mockWarehouses[0];
    expect(component.getTotalQuantity(warehouse)).toBe(30);
  });

  it('should navigate to warehouse details', () => {
    component.viewWarehouse('1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/warehouses', '1']);
  });

  it('should navigate to create warehouse', () => {
    component.createWarehouse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/warehouses/new']);
  });
}); 