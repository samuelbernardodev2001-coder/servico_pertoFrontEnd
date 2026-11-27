import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSnackBarModule,
    MatIcon
],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>handyman</mat-icon>
            Marketplace de Serviços
          </mat-card-title>
          <mat-card-subtitle>Faça login para continuar</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" placeholder="email@exemplo.com">
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Senha</mat-label>
            <input matInput [(ngModel)]="password" type="password" placeholder="******">
          </mat-form-field>
          
          <div class="demo-users">
            <p>Contas demo:</p>
            <button mat-stroked-button (click)="preencherDemo('carlos@email.com', '123456')">
              Cliente (Carlos)
            </button>
            <button mat-stroked-button (click)="preencherDemo('pedro@email.com', '123456')">
              Prestador (Pedro)
            </button>
            <button mat-stroked-button (click)="preencherDemo('admin@email.com', '123456')">
              Admin
            </button>
          </div>
        </mat-card-content>
        
        <mat-card-actions align="end">
          <button mat-button routerLink="/cadastro">Criar conta</button>
          <button mat-raised-button color="primary" (click)="login()" [disabled]="!email || !password">
            Entrar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 20px;
    }
    .login-card {
      max-width: 450px;
      width: 100%;
      padding: 24px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-card-header {
      text-align: center;
      margin-bottom: 24px;
    }
    mat-card-header mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    .demo-users {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      text-align: center;
    }
    .demo-users p {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    .demo-users button {
      margin: 4px;
    }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  email = '';
  password = '';
  
  async login() {
    const success = await this.auth.login(this.email, this.password);
    if (success) {
      this.snackBar.open('Login realizado!', 'OK', { duration: 2000 });
      this.router.navigate(['/vitrine']);
    } else {
      this.snackBar.open('Email ou senha inválidos', 'Fechar');
    }
  }
  
  preencherDemo(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.login();
  }
}