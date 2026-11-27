import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServiceOrder, StatusOrdem, Perfil } from '../../../core/models';
import { DadosMockService } from '../../../core/services/dados-mock.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'ordem-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatChipsModule, 
    MatMenuModule, 
    MatSnackBarModule
  ],
  template: `
    <div class="ordem-list">
      @if (ordens.length === 0) {
        <div class="empty-state">
          <mat-icon>inbox</mat-icon>
          <p>Nenhuma ordem encontrada nesta categoria</p>
        </div>
      }

      @for (ordem of ordens; track ordem.id) {
        <mat-card class="ordem-card" [routerLink]="['/ordem', ordem.id]">
          <mat-card-content>
            <div class="ordem-header">
              <div class="ordem-title">
                <h3>{{ ordem.servicoTitulo }}</h3>
                <span class="ordem-date">{{ ordem.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <mat-chip 
                [style.background]="getStatusColor(ordem.status)"
                style="color: white; font-size: 12px;">
                {{ getStatusLabel(ordem.status) }}
              </mat-chip>
            </div>

            <div class="ordem-participants">
              @if (role === Perfil.CLIENTE) {
                <span><strong>Prestador:</strong> {{ ordem.prestadorNome }}</span>
              } @else if (role === Perfil.PRESTADOR) {
                <span><strong>Cliente:</strong> {{ ordem.clienteNome }}</span>
              }
            </div>

            <p class="ordem-desc">{{ ordem.descricao | slice:0:120 }}{{ ordem.descricao.length > 120 ? '...' : '' }}</p>

            <div class="ordem-footer">
              <span class="ordem-valor">R$ {{ ordem.valorTotal.toFixed(2) }}</span>
              <div class="ordem-actions">
                @if (role === Perfil.PRESTADOR && ordem.status === StatusOrdem.REQUESTED) {
                  <button mat-raised-button color="primary" (click)="$event.stopPropagation(); alterarStatus(ordem.id, StatusOrdem.ACCEPTED)">
                    <mat-icon>check</mat-icon> Aceitar
                  </button>
                  <button mat-raised-button color="warn" (click)="$event.stopPropagation(); alterarStatus(ordem.id, StatusOrdem.CANCELED)">
                    <mat-icon>close</mat-icon> Recusar
                  </button>
                }
                
                @if (role === Perfil.PRESTADOR && ordem.status === StatusOrdem.ACCEPTED) {
                  <button mat-raised-button color="primary" (click)="$event.stopPropagation(); alterarStatus(ordem.id, StatusOrdem.COMPLETED)">
                    <mat-icon>done_all</mat-icon> Concluir
                  </button>
                  <button mat-stroked-button color="warn" (click)="$event.stopPropagation(); alterarStatus(ordem.id, StatusOrdem.CANCELED)">
                    <mat-icon>cancel</mat-icon> Cancelar
                  </button>
                }
                
                @if (role === Perfil.CLIENTE && ordem.status === StatusOrdem.REQUESTED) {
                  <button mat-stroked-button color="warn" (click)="$event.stopPropagation(); alterarStatus(ordem.id, StatusOrdem.CANCELED)">
                    <mat-icon>cancel</mat-icon> Cancelar
                  </button>
                }

                <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <a mat-menu-item [routerLink]="['/ordem', ordem.id]">
                    <mat-icon>visibility</mat-icon> Detalhes
                  </a>
                  <a mat-menu-item [routerLink]="['/ordem', ordem.id, 'chat']">
                    <mat-icon>chat</mat-icon> Chat
                  </a>
                </mat-menu>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .ordem-list { 
      display: flex; 
      flex-direction: column; 
      gap: 16px; 
      padding: 16px 0; 
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
      
      mat-icon { 
        font-size: 64px; 
        width: 64px; 
        height: 64px; 
        color: #ddd; 
        margin-bottom: 16px; 
      }
    }

    .ordem-card {
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      border-radius: 12px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
    }

    .ordem-header {
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 12px;
      
      .ordem-title {
        h3 { 
          font-size: 18px; 
          font-weight: 600; 
          margin: 0; 
        }
        
        .ordem-date { 
          font-size: 12px; 
          color: var(--text-secondary); 
        }
      }
    }

    .ordem-participants {
      font-size: 14px; 
      color: var(--text-secondary); 
      margin-bottom: 8px;
    }

    .ordem-desc {
      font-size: 14px; 
      color: #555; 
      line-height: 1.5; 
      margin-bottom: 16px;
    }

    .ordem-footer {
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding-top: 12px; 
      border-top: 1px solid var(--border);

      .ordem-valor { 
        font-size: 18px; 
        font-weight: 700; 
        color: #2e7d32; 
      }

      .ordem-actions {
        display: flex; 
        gap: 8px; 
        align-items: center;
        
        button { 
          font-size: 13px; 
        }
      }
    }
  `]
})
export class OrdemListComponent {
  @Input() ordens: ServiceOrder[] = [];
  @Input() role: Perfil = Perfil.CLIENTE;
  @Output() statusChanged = new EventEmitter<void>();

  // Expoe enums para uso no template
  StatusOrdem = StatusOrdem;
  Perfil = Perfil;

  private mockService = inject(DadosMockService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  getStatusLabel(status: StatusOrdem): string {
    const labels: Record<string, string> = {
      'REQUESTED': 'Solicitado',
      'ACCEPTED': 'Aceito',
      'COMPLETED': 'Concluído',
      'CANCELED': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusColor(status: StatusOrdem): string {
    const colors: Record<string, string> = {
      'REQUESTED': '#ff9800',   // Laranja
      'ACCEPTED': '#2196f3',    // Azul
      'COMPLETED': '#4caf50',   // Verde
      'CANCELED': '#f44336'     // Vermelho
    };
    return colors[status] || '#757575';
  }

  async alterarStatus(ordemId: string, novoStatus: StatusOrdem) {
    try {
      const usuarioId = this.authService.getCurrentUserId();
      await this.mockService.atualizarStatusOrdem(ordemId, novoStatus, usuarioId);
      this.snackBar.open('Status atualizado com sucesso!', 'OK', { duration: 2000 });
      this.statusChanged.emit();
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Erro ao atualizar status', 'Fechar', { 
        duration: 5000, 
        panelClass: 'error-snack' 
      });
    }
  }
}