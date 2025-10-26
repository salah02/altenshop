import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { CartService } from "app/shared/services/cart.service";

@Component({
  selector: "app-cart",
  standalone: true,
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],

  imports: [CommonModule, ButtonModule]
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  public readonly items = this.cartService.items;

  public readonly total = computed(() =>
    this.items().reduce((sum, p) => sum + p.price * (p.quantity || 1), 0)
  );
  
  public removeFromCart(id: number) {
    this.cartService.remove(id);
  }
}
