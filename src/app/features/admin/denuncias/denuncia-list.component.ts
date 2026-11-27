import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Denuncia, StatusDenuncia } from '../../../core/models';


@Component({
  selector: 'denuncia-list',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatDividerModule, MatDialogModule,
    MatFormFieldModule, MatInputModule
  ],
  template: `
    @if (denuncias.length === 0) {
      <div class="empty-state">
        <mat-icon>check_circle</mat-icon>
        <p>Nenhuma denúncia encontrada</p>
      </div>
    }

    @for (denuncia of denuncias; track denuncia.id) {
      <mat-card class="denuncia-card">
        <mat-card-content>
          <div class="denuncia-header">
            <div class="denuncia-title">
              <mat-icon [class.text-warn]="denuncia.status === 'PENDENTE'"
                       [class.text-success]="denuncia.status === 'RESOLVIDA'"
                       [class.text-disabled]="denuncia.status === 'REJEITADA'">report</mat-icon>
              <div>
                <h3>Denúncia #{{ denuncia.id.slice(0,8) }}</h3>
                <span class="denuncia-date">{{ denuncia.criadoEm | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
            <mat-chip [style.background]="statusColor(denuncia.status)" style="color:white">
              {{ statusLabel(denuncia.status) }}
            </mat-chip>
          </div>

          <mat-divider class="my-2" />

          <div class="denuncia-body">
            <p><strong>Denunciante:</strong> {{ denuncia.denuncianteNome }}</p>
            <p><strong>Denunciado:</strong> {{ denuncia.denunciadoNome }}</p>
            <p><strong>Motivo:</strong> {{ denuncia.motivo }}</p>
            <p class="descricao">{{ denuncia.descricao }}</p>
          </div>

          @if (denuncia.observacaoModeracao) {
            <div class="moderacao-obs">
              <mat-icon>comment</mat-icon>
              <span>{{ denuncia.observacaoModeracao }}</span>
            </div>
          }

          @if (denuncia.status === 'PENDENTE') {
            <mat-divider class="my-2" />
            <div class="denuncia-actions">
              <button mat-raised-button color="primary" (click)="moderar(denuncia.id, StatusDenuncia.RESOLVIDA)">
                <mat-icon>check_circle</mat-icon> Resolver
              </button>
              <button mat-raised-button color="warn" (click)="moderar(denuncia.id, StatusDenuncia.REJEITADA)">
                <mat-icon>cancel</mat-icon> Rejeitar
              </button>
            </div>
          }
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .denuncia-card { margin-bottom: 16px; border-radius: 12px; }
    .empty-state { text-align: center; padding: 40px; color: var(--text-secondary); mat-icon { font-size: 48px; width:48px; height:48px; color:#ddd; } }

    .denuncia-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .denuncia-title { display: flex; align-items: center; gap: 12px; h3 { margin:0; font-size:16px; } .denuncia-date { font-size:12px; color:var(--text-secondary); } }
    
    .text-warn { color: #ff9800; }
    .text-success { color: #4caf50; }
    .text-disabled { color: #999; }

    .denuncia-body { p { margin-bottom: 8px; font-size:14px; } .descricao { color: var(--text-secondary); font-style: italic; } }

    .moderacao-obs { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding: 8px 12px; background: #f5f5f5; border-radius: 8px; font-size: 13px; color: var(--text-secondary); mat-icon { font-size: 18px; width:18px; height:18px; } }

    .denuncia-actions { display: flex; gap: 12px; margin-top: 12px; }

    .my-2 { margin: 12px 0; }
  `]
})
export class DenunciaListComponent {
  @Input() denuncias: Denuncia[] = [];
  @Input() onModerar!: (id: string, status: StatusDenuncia, obs: string) => void;

  StatusDenuncia = StatusDenuncia;
  
  statusColor(status: StatusDenuncia): string {
    const colors = { 'PENDENTE': '#ff9800', 'RESOLVIDA': '#4caf50', 'REJEITADA': '#f44336' };
    return colors[status] || '#999';
  }

  statusLabel(status: StatusDenuncia): string {
    const labels = { 'PENDENTE': 'Pendente', 'RESOLVIDA': 'Resolvida', 'REJEITADA': 'Rejeitada' };
    return labels[status] || status;
  }

  moderar(id: string, status: StatusDenuncia) {
    const observacao = prompt(`Observação para ${status === 'RESOLVIDA' ? 'resolver' : 'rejeitar'} esta denúncia:`);
    if (observacao !== null) {
      this.onModerar(id, status, observacao || 'Moderado via painel');
    }
  }
}