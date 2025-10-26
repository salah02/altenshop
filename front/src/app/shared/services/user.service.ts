import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userEmail = signal<string | null>(null);

  constructor() {
    this.loadUserFromToken();
  }

  /** Charge l'utilisateur à partir du JWT stocké */
  loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.userEmail.set(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userEmail.set(payload.unique_name || payload.email || null);
    } catch (e) {
      console.error('JWT invalide', e);
      this.userEmail.set(null);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.userEmail.set(null);
  }

  get isAdmin() {
    return this.userEmail() === 'admin@admin.com';
  }
}
