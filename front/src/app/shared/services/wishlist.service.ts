import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Product } from "app/products/data-access/product.model";

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly path = "http://localhost:5048/api/wishlist";

  private readonly _wishlist = signal<Product[]>([]);
  public readonly wishlist = this._wishlist.asReadonly();


  getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(this.path).pipe(
      tap(products => this._wishlist.set(products))
    );
  }

  addToWishlist(productId: number): Observable<boolean> {
    
    return this.http.post<boolean>(`${this.path}/${productId}`, {}).pipe(
      tap(() => {
        this.getWishlist().subscribe();
      })
    );
  }

  removeFromWishlist(productId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
      tap(() => {
        this._wishlist.update(list => list.filter(p => p.id !== productId));
      })
    );
  }
}
