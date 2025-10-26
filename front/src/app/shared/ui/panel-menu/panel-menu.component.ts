import { Component, inject, effect } from "@angular/core";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from "primeng/panelmenu";
import { Router } from '@angular/router';

@Component({
  selector: "app-panel-menu",
  standalone: true,
  imports: [PanelMenuModule],
  template: `<p-panelMenu [model]="items" styleClass="w-full" />`,
})
export class PanelMenuComponent {
  items: MenuItem[] = [];

  private readonly router = inject(Router);

  constructor() {
    this.updateMenu();

    effect(() => {
      this.updateMenu();
    });
  }

  private updateMenu() {
    this.items = [
      { label: "Accueil", icon: "pi pi-home", routerLink: ["/home"] },
      { label: "Produits", icon: "pi pi-barcode", routerLink: ["/products/list"] },
      { label: "Contact", icon: "pi pi-envelope", routerLink: ["/contact"] },
      { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
    window.location.reload();
  }
}
