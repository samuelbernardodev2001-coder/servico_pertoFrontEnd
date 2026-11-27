import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component.js';
import { RoleSwitcherService } from './core/services/role-switcher.service.js';
import { toSignal } from '@angular/core/rxjs-interop';
import { Perfil } from './core/models/index.js';  // ← Certifique-se que está importado

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container" [class.admin-mode]="currentRole() === Perfil.ADMIN">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
      <footer class="app-footer">
        <div class="footer-content">
          <span>&copy; 2026 Marketplace de Serviços Locais</span>
          <span class="footer-role" [class.client]="currentRole() === Perfil.CLIENTE"
                                   [class.provider]="currentRole() === Perfil.PRESTADOR"
                                   [class.admin]="currentRole() === Perfil.ADMIN">
            Modo: {{ currentRole() }}
          </span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      
      &.admin-mode {
        --primary: #7b1fa2;
        --primary-light: #ae52d4;
        --primary-dark: #4a0072;
      }
    }

    .main-content {
      flex: 1;
      padding: 24px;
      max-width: 1400px;
      width: 100%;
      margin: var(--header-height) auto 0;
      
      @media (max-width: 768px) {
        padding: 16px;
      }
    }

    .app-footer {
      background: var(--surface);
      border-top: 1px solid var(--border);
      padding: 16px 24px;
      
      .footer-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: var(--text-secondary);
      }

      .footer-role {
        padding: 4px 12px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        &.client { background: #e3f2fd; color: #1565c0; }
        &.provider { background: #e8f5e9; color: #2e7d32; }
        &.admin { background: #f3e5f5; color: #7b1fa2; }
      }
    }
  `]
})
export class AppComponent {
  // Adicione Perfil como propriedade da classe para usar no template
  Perfil = Perfil;
  
  currentRole = toSignal(this.roleSwitcher.role$, { initialValue: Perfil.CLIENTE });
  
  constructor(private roleSwitcher: RoleSwitcherService) {}
}