import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { WishlistService } from 'app/shared/services/wishlist.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule,CommonModule,CardModule,ToastModule],
  templateUrl: './login.component.html',
  providers: [MessageService]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private wishlistService = inject(WishlistService);

 
  public showRegister = signal(false);
  public loading = signal(false);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public registerForm = this.fb.group({
    firstname: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public submitLogin() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);

    this.http.post<{ token: string }>(
      'http://localhost:5048/api/users/token',
      this.loginForm.value
    ).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);  // Stockage du JWT
        this.wishlistService.getWishlist().subscribe();
        this.router.navigate(['/home']);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Email ou mot de passe invalide' });
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
  public submitRegister() {
    if (this.registerForm.invalid) return;
    this.loading.set(true);
    this.http.post('http://localhost:5048/api/users/account', this.registerForm.value)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Compte créé ! Connectez-vous maintenant.' });
          this.showRegister.set(false);
        },
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false),
      });
  }
}
