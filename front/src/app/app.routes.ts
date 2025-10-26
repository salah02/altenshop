import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { ContactComponent } from "./shared/features/contact/contact.component";
import { AuthGuard } from "./shared/guards/auth.guard";

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "shopping-cart",
    loadComponent: () =>
      import("./shared/features/cart/cart.component").then(
        (m) => m.CartComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "wishlist",
    loadComponent: () =>
      import("./shared/features/wishlist/wishlist.component").then(
        (m) => m.WishlistComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
];
