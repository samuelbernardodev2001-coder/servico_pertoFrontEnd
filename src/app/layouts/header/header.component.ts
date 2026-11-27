// src/app/layouts/header/header.component.ts
import { Component, signal, inject, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleSwitcherService } from '../../core/services/role-switcher.service';
import { AuthService } from '../../core/services/auth.service';
import { Perfil } from '../../core/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatBadgeModule, MatSelectModule,
    MatFormFieldModule, MatDividerModule,
    FormsModule
  ],
  template: `
    <mat-toolbar class="app-header" color="primary">
      <div class="header-container">
        <button mat-icon-button class="hide-desktop" (click)="toggleMenu()">
          <mat-icon>menu</mat-icon>
        </button>

        <a routerLink="/" class="logo">
          <mat-icon>handyman</mat-icon>
          <span class="logo-text">ServiçosLocais</span>
        </a>

        <div class="role-selector" [class.admin-mode]="selectedRole() === 'ADMIN'">
          <mat-form-field appearance="fill" dense>
            <mat-label>Modo</mat-label>
            <mat-select [value]="selectedRole()" (selectionChange)="onRoleChange($event.value)">
              <mat-option value="CLIENTE">
                <mat-icon>person</mat-icon> Cliente
              </mat-option>
              <mat-option value="PRESTADOR">
                <mat-icon>build</mat-icon> Prestador
              </mat-option>
              <mat-option value="ADMIN">
                <mat-icon>admin_panel_settings</mat-icon> Admin
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <nav class="nav-links hide-mobile" [class.open]="mobileMenuOpen()">
          @if (selectedRole() === Perfil.CLIENTE) {
            <a mat-button routerLink="/vitrine" routerLinkActive="active-link">
              <mat-icon>storefront</mat-icon> Serviços
            </a>
            <a mat-button routerLink="/ordens" routerLinkActive="active-link">
              <mat-icon>assignment</mat-icon> Ordens
            </a>
            <a mat-button routerLink="/favoritos" routerLinkActive="active-link">
              <mat-icon>favorite</mat-icon> Favoritos
            </a>
          }

          @if (selectedRole() === Perfil.PRESTADOR) {
            <a mat-button routerLink="/prestador/servicos" routerLinkActive="active-link">
              <mat-icon>miscellaneous_services</mat-icon> Meus Serviços
            </a>
            <a mat-button routerLink="/ordens" routerLinkActive="active-link">
              <mat-icon>assignment</mat-icon> Ordens
            </a>
          }

          @if (selectedRole() === Perfil.ADMIN) {
            <a mat-button routerLink="/admin/denuncias" routerLinkActive="active-link">
              <mat-icon>report</mat-icon> Denúncias
            </a>
            <a mat-button routerLink="/admin/categorias" routerLinkActive="active-link">
              <mat-icon>category</mat-icon> Categorias
            </a>
            <a mat-button routerLink="/admin/usuarios" routerLinkActive="active-link">
              <mat-icon>people</mat-icon> Usuários
            </a>
          }
        </nav>

        <div class="header-actions">
          <button mat-icon-button [matBadge]="notificacoesNaoLidas()" matBadgeColor="warn">
            <mat-icon>notifications</mat-icon>
          </button>
          
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item disabled>
              <mat-icon>person</mat-icon>
              {{ currentUserName() }}
            </button>
            <mat-divider />
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Sair
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: var(--header-height);
      box-shadow: 0 2px 8px var(--shadow);
    }

    .header-container {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: white;
      font-weight: 700;
      font-size: 18px;

      .logo-text {
        @media (max-width: 480px) { display: none; }
      }
    }

    .role-selector {
      ::ng-deep .mat-mdc-form-field {
        width: 130px;
        
        .mat-mdc-text-field-wrapper { height: 42px; }
        .mat-mdc-select-value { color: white; font-size: 13px; }
        .mat-mdc-select-arrow { color: white; }
        .mdc-notched-outline__leading,
        .mdc-notched-outline__notch,
        .mdc-notched-outline__trailing {
          border-color: rgba(255,255,255,0.3) !important;
        }
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;

      a {
        color: rgba(255,255,255,0.85);
        font-size: 14px;

        &.active-link {
          color: white;
          background: rgba(255,255,255,0.15);
        }

        &:hover { color: white; }
      }

      &.open {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: var(--header-height);
        left: 0;
        right: 0;
        background: var(--primary);
        padding: 16px;
        box-shadow: 0 4px 8px var(--shadow);
        z-index: 999;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: auto;
    }

    @media (max-width: 768px) {
      .nav-links:not(.open) { display: none; }
    }
  `]
})
export class HeaderComponent {
  private roleSwitcher = inject(RoleSwitcherService);
  private auth = inject(AuthService);
  
  Perfil = Perfil;
  selectedRole = signal<Perfil>(Perfil.CLIENTE);
  mobileMenuOpen = signal(false);
  notificacoesNaoLidas = signal(3);
  currentUserName = signal('Carregando...');

  constructor() {
    this.currentUserName.set(this.auth.getCurrentUserNome());
    
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.currentUserName.set(user.nome);
      }
    });

    this.roleSwitcher.role$.subscribe(role => {
      this.selectedRole.set(role);
    });
  }

  onRoleChange(role: Perfil): void {
    this.roleSwitcher.setRole(role);
    this.mobileMenuOpen.set(false);
  }

  toggleMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }
}