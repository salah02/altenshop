import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product } from "app/products/data-access/product.model";
import { SelectItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';

const emptyProduct: Product = {
  id: 0,
  code: '',
  name: '',
  description: '',
  image: '',
  category: '',
  price: 0,
  quantity: 0,
  internalReference: '',
  shellId: 0,
  inventoryStatus: 'INSTOCK',
  rating: 0,
  createdAt: '',
  updatedAt: '',
};

@Component({
  selector: "app-product-form",
  template: `
    <form #form="ngForm" (ngSubmit)="onSave()">
      <div class="form-field">
        <label for="name">Nom</label>
        <input pInputText
               type="text"
               id="name"
               name="name"
               [(ngModel)]="localProduct.name"
               required>
      </div>
      <div class="form-field">
        <label for="price">Prix</label>
        <p-inputNumber 
          [(ngModel)]="localProduct.price" 
          name="price"
          mode="decimal"
          required/> 
      </div>
      <div class="form-field">
        <label for="description">Description</label>
        <textarea pInputTextarea 
                  id="description"
                  name="description"
                  rows="5" 
                  cols="30" 
                  [(ngModel)]="localProduct.description">
        </textarea>
      </div>
      <div class="form-field">
        <label for="category">Catégorie</label>
        <p-dropdown 
          [options]="categories" 
          [(ngModel)]="localProduct.category" 
          name="category"
          appendTo="body"
        />
      </div>
      <div class="flex justify-content-between">
        <p-button type="button" (click)="onCancel()" label="Annuler" severity="help"/>
        <p-button type="submit" [disabled]="!form.valid" label="Enregistrer" severity="success"/>
      </div>
    </form>
  `,
  styleUrls: ["./product-form.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductFormComponent {
  @Input() product: Product = emptyProduct;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  localProduct: Product = { ...emptyProduct };

  readonly categories: SelectItem[] = [
    { value: "Accessories", label: "Accessories" },
    { value: "Fitness", label: "Fitness" },
    { value: "Clothing", label: "Clothing" },
    { value: "Electronics", label: "Electronics" },
  ];

  ngOnChanges() {
    this.resetForm();
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }

  onSave() {
    this.save.emit({ ...this.localProduct });
    this.resetForm();
  }

  private resetForm() {
    this.localProduct = { ...this.product ?? emptyProduct };
  }
}
