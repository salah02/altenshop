import {
  Component,inject
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { Router } from "@angular/router";
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from "./shared/services/cart.service";
import { WishlistService } from 'app/shared/services/wishlist.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent],
})
export class AppComponent {
  title = "ALTEN SHOP";  
  readonly cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  private readonly router = inject(Router);
  goToCart() {
    this.router.navigate(["/shopping-cart"]);
  }
   goToWishlist() {
    this.router.navigate(['/wishlist']);
  }
}
