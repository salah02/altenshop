import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from 'app/products/data-access/product.model';
import { WishlistService } from 'app/shared/services/wishlist.service';
import { CartService } from 'app/shared/services/cart.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  products: Product[] = [];

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erreur chargement wishlist :', err)
    });
  }

  removeFromWishlist(productId: number) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => (this.products = this.products.filter(p => p.id !== productId)),
      error: (err) => console.error('Erreur suppression :', err)
    });
  }

  addToCart(product: Product) {
    this.cartService.add(product);
    this.removeFromWishlist(product.id);
  }
}
