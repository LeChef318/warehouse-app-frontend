import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CategoryService } from './category.service';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const mockCategories: Category[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all categories', fakeAsync(() => {
    let result: Category[] | undefined;
    
    service.getCategories().subscribe(categories => {
      result = categories;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
    
    tick();
    expect(result).toEqual(mockCategories);
  }));

  it('should get a single category by id', fakeAsync(() => {
    const mockCategory: Category = { id: 1, name: 'Electronics' };
    let result: Category | undefined;

    service.getCategory(1).subscribe(category => {
      result = category;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
    
    tick();
    expect(result).toEqual(mockCategory);
  }));

  it('should create a new category', fakeAsync(() => {
    const newCategory: Partial<Category> = { name: 'New Category' };
    const createdCategory: Category = { id: 3, name: 'New Category' };
    let result: Category | undefined;

    service.createCategory(newCategory).subscribe(category => {
      result = category;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(createdCategory);
    
    tick();
    expect(result).toEqual(createdCategory);
  }));

  it('should update an existing category', fakeAsync(() => {
    const updatedCategory: Partial<Category> = { name: 'Updated Category' };
    const responseCategory: Category = { id: 1, name: 'Updated Category' };
    let result: Category | undefined;

    service.updateCategory(1, updatedCategory).subscribe(category => {
      result = category;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCategory);
    req.flush(responseCategory);
    
    tick();
    expect(result).toEqual(responseCategory);
  }));

  it('should delete a category', fakeAsync(() => {
    let result: void | null | undefined;

    service.deleteCategory(1).subscribe(response => {
      result = response;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    
    tick();
    expect(result).toBeNull();
  }));

  it('should get products by category', fakeAsync(() => {
    const mockProducts = [
      { id: 1, name: 'Product 1', categoryId: 1 },
      { id: 2, name: 'Product 2', categoryId: 1 }
    ];
    let result: any[] | undefined;

    service.getProductsByCategory(1).subscribe(products => {
      result = products;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/category/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
    
    tick();
    expect(result).toEqual(mockProducts);
  }));

  it('should handle error when getting categories', fakeAsync(() => {
    const errorMessage = 'Failed to load categories. Please try again later.';
    let error: Error | undefined;

    service.getCategories().subscribe({
      error: (err) => {
        error = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    req.error(new ErrorEvent('Network error'));
    
    tick();
    expect(error?.message).toBe(errorMessage);
  }));

  it('should handle error when getting products by category', fakeAsync(() => {
    const errorMessage = 'Failed to load products. Please try again later.';
    let error: Error | undefined;

    service.getProductsByCategory(1).subscribe({
      error: (err) => {
        error = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/category/1`);
    req.error(new ErrorEvent('Network error'));
    
    tick();
    expect(error?.message).toBe(errorMessage);
  }));

  it('should handle error when getting a single category', fakeAsync(() => {
    let error: Error | undefined;

    service.getCategory(1).subscribe({
      error: (err) => {
        error = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories/1`);
    req.error(new ErrorEvent('Network error'));
    
    tick();
    expect(error).toBeTruthy();
  }));

  it('should handle error when creating a category', fakeAsync(() => {
    const newCategory: Partial<Category> = { name: 'New Category' };
    let error: Error | undefined;

    service.createCategory(newCategory).subscribe({
      error: (err) => {
        error = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    req.error(new ErrorEvent('Network error'));
    
    tick();
    expect(error).toBeTruthy();
  }));

  it('should handle error when updating a category', fakeAsync(() => {
    const updatedCategory: Partial<Category> = { name: 'Updated Category' };
    let error: Error | undefined;

    service.updateCategory(1, updatedCategory).subscribe({
      error: (err) => {
        error = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories/1`);
    req.error(new ErrorEvent('Network error'));
    
    tick();
    expect(error).toBeTruthy();
  }));
}); 