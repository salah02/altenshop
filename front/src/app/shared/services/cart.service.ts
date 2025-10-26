import { Injectable, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";

@Injectable({ providedIn: "root" })
export class CartService {
  public readonly items = signal<Product[]>([]);

  add(product: Product) {
    const current = [...this.items()];
    const existing = current.find(p => p.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (product.quantity || 1);
    } else {
      current.push({ ...product, quantity: product.quantity || 1 });
    }
    this.items.set(current);
  }

  remove(id: number) {
    this.items.set(this.items().filter(p => p.id !== id));
  }

  clear() {
    this.items.set([]);
  }
}

