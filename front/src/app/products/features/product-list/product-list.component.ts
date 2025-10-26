import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { PaginatorModule } from "primeng/paginator";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { CartService } from "app/shared/services/cart.service";
import { CommonModule } from "@angular/common";
import { UserService } from "app/shared/services/user.service";
import { MessageService, SelectItem } from "primeng/api";
import { WishlistService } from "app/shared/services/wishlist.service";
import { ToastModule } from 'primeng/toast';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: "",
  updatedAt: "",
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    PaginatorModule,
    ProductFormComponent,
    ToastModule
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  messageService = inject(MessageService);

  private readonly cartService = inject(CartService);
  private readonly userService = inject(UserService);

  public readonly products = this.productsService.products;
  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  public categories: SelectItem[] = [
    { label: "Toutes les catégories", value: null },
    { label: "Accessories", value: "Accessories" },
    { label: "Fitness", value: "Fitness" },
    { label: "Clothing", value: "Clothing" },
    { label: "Electronics", value: "Electronics" },
  ];
  public selectedCategory = signal<string | null>(null);
  public first = signal(0);
  public rows = signal(5);

  public readonly filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    const list = this.products();
    return cat ? list.filter((p) => p.category === cat) : list;
  });

  public readonly paginatedProducts = computed(() => {
    const start = this.first();
    const end = start + this.rows();
    return this.filteredProducts().slice(start, end);
  });

  public readonly isAdmin = computed(() => this.userService.userEmail() === "admin@admin.com");

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  addToCart(product: Product, quantity: number) {
    if (!quantity || quantity <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Quantité invalide',
        detail: 'Veuillez sélectionner une quantité supérieure à 0.'
      });
      return;
    }
    this.cartService.add({ ...product, quantity });
  }
  

  addToWishlist(productId: number) {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Produit ajouté à votre liste d’envie 💖'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible d’ajouter le produit à la liste d’envie.'
        });
      }
    });
  }

  // --- CRUD produits ---
  onCreate() {
    if (!this.isAdmin()) return;
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  onUpdate(product: Product) {
    if (!this.isAdmin()) return;
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  onDelete(product: Product) {
    if (!this.isAdmin()) return;
    this.productsService.delete(product.id).subscribe();
  }

  onSave(product: Product) {
    if (!this.isAdmin()) return;

    const obs = this.isCreation
      ? this.productsService.create(product)
      : this.productsService.update(product);

    obs.subscribe(() => this.closeDialog());
  }

  onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
    this.editedProduct.set(emptyProduct);
  }

  trackById(index: number, product: Product) {
    return product.id;
  }
}
