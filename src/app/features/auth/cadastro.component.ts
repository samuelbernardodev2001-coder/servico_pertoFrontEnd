import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { Perfil } from '../../core/models';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="cadastro-container">
      <mat-card class="cadastro-card">
        <mat-card-header>
          <mat-card-title>Criar nova conta</mat-card-title>
          <mat-card-subtitle>Cadastre-se para começar</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome completo</mat-label>
            <input matInput [(ngModel)]="nome">
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email">
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Senha</mat-label>
            <input matInput [(ngModel)]="password" type="password">
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tipo de conta</mat-label>
            <mat-select [(ngModel)]="tipo">
              <mat-option [value]="Perfil.CLIENTE">Cliente</mat-option>
              <mat-option [value]="Perfil.PRESTADOR">Prestador</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
        
        <mat-card-actions align="end">
          <button mat-button routerLink="/login">Já tenho conta</button>
          <button mat-raised-button color="primary" (click)="cadastrar()" 
                  [disabled]="!nome || !email || !password">
            Cadastrar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .cadastro-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 20px;
    }
    .cadastro-card {
      max-width: 500px;
      width: 100%;
      padding: 24px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class CadastroComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  Perfil = Perfil;
  nome = '';
  email = '';
  password = '';
  tipo = Perfil.CLIENTE;
  
  async cadastrar() {
    const success = await this.auth.cadastrar(this.nome, this.email, this.password, this.tipo);
    if (success) {
      this.snackBar.open('Cadastro realizado!', 'OK', { duration: 2000 });
      this.router.navigate(['/vitrine']);
    } else {
      this.snackBar.open('Erro ao cadastrar', 'Fechar');
    }
  }
}