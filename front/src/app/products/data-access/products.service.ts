import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: "root"
}) 
export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly path = "http://localhost:5048/api/products";
    
    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path).pipe(
          catchError(() => {
            return this.http.get<Product[]>("assets/products.json");
          }),
          tap((products) => {
            this._products.set(products);
          })
        );
      }

public create(product: Product): Observable<boolean> {
    const now = new Date().toISOString();
    product.createdAt = now;
    product.updatedAt = now;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    return this.http.post<boolean>(this.path, product, { headers, withCredentials: true }).pipe(
        
        tap((success) => {
            
             
            
            if (success) {
                this._products.update(products => [product, ...products]);
            }
        }),
        catchError((error) => {
            console.error('Erreur lors de la création du produit:', error);
            return of(false); // retourne false si le POST échoue
        })
    );
}


    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${product.id}`, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}