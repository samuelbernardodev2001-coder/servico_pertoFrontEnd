import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { Servico } from '../../../core/models';

@Component({
  selector: 'app-meus-servicos',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatSlideToggleModule, MatSnackBarModule
  ],
  template: `
    <div class="meus-servicos-page fade-in">
      <div class="page-header">
        <h1>Meus Serviços</h1>
        <button mat-raised-button color="primary" routerLink="/prestador/servico/novo">
          <mat-icon>add</mat-icon> Novo Serviço
        </button>
      </div>

      @if (servicos().length === 0) {
        <div class="empty-state">
          <mat-icon>miscellaneous_services</mat-icon>
          <h2>Nenhum serviço cadastrado</h2>
          <p>Crie seu primeiro serviço para começar a receber pedidos</p>
          <button mat-raised-button color="primary" routerLink="/prestador/servico/novo">
            <mat-icon>add</mat-icon> Criar Serviço
          </button>
        </div>
      }

      <div class="servicos-list">
        @for (servico of servicos(); track servico.id) {
          <mat-card class="servico-card" [class.inactive]="!servico.ativo">
            <div class="card-left">
              @if (servico.imagensUrls.length > 0) {
                <img [src]="servico.imagensUrls[0]" [alt]="servico.titulo" class="card-thumb">
              }
              <div class="card-info">
                <h3>{{ servico.titulo }}</h3>
                <span class="categoria">{{ servico.categoriaNome }}</span>
                <div class="card-stats">
                  <span class="rating"><mat-icon>star</mat-icon> {{ servico.mediaAvaliacao.toFixed(1) }} ({{ servico.totalAvaliacoes }})</span>
                </div>
              </div>
            </div>
            <div class="card-right">
              <span class="preco">R$ {{ servico.preco.toFixed(2) }}</span>
              <div class="card-actions">
                <button mat-stroked-button routerLink="/prestador/servico/{{ servico.id }}/editar">
                  <mat-icon>edit</mat-icon> Editar
                </button>
                <button mat-stroked-button routerLink="/prestador/galeria/{{ servico.id }}">
                  <mat-icon>photo_library</mat-icon> Fotos
                </button>
                <mat-slide-toggle [checked]="servico.ativo" (change)="toggleAtivo(servico.id, $event.checked)">
                  {{ servico.ativo ? 'Ativo' : 'Inativo' }}
                </mat-slide-toggle>
              </div>
            </div>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .meus-servicos-page { max-width: 900px; margin: 0 auto; }
    
    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      h1 { font-size: 28px; font-weight: 700; margin: 0; }
    }

    .empty-state {
      text-align: center; padding: 60px 20px;
      mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ddd; margin-bottom: 16px; }
      h2 { color: var(--text-secondary); margin-bottom: 8px; }
      p { color: #999; margin-bottom: 24px; }
    }

    .servicos-list { display: flex; flex-direction: column; gap: 16px; }

    .servico-card {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px; border-radius: 12px;
      transition: opacity 0.3s;

      &.inactive { opacity: 0.5; }

      .card-left { display: flex; align-items: center; gap: 16px; }
      .card-thumb { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }

      .card-info {
        h3 { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
        .categoria { font-size: 13px; color: var(--text-secondary); }
        .card-stats { margin-top: 4px; .rating { display: flex; align-items: center; gap: 4px; font-size: 13px; mat-icon { color: #ffc107; font-size: 16px; } } }
      }

      .card-right {
        text-align: right;
        .preco { display: block; font-size: 22px; font-weight: 700; color: #2e7d32; margin-bottom: 8px; }
        .card-actions { display: flex; align-items: center; gap: 8px; }
      }
    }
  `]
})
export class MeusServicosComponent implements OnInit {
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);

  servicos = signal<Servico[]>([]);

  async ngOnInit() {
    try {
      const servicos = await this.mockService.listarServicosDoPrestador(true);
      this.servicos.set(servicos);
    } catch (e) {
      this.snackBar.open('Erro ao carregar serviços', 'Fechar');
    }
  }

  async toggleAtivo(servicoId: string, ativo: boolean) {
    try {
      await this.mockService.atualizarServico(servicoId, { ativo });
      const updated = this.servicos().map(s => s.id === servicoId ? { ...s, ativo } : s);
      this.servicos.set(updated);
      this.snackBar.open(ativo ? 'Serviço ativado' : 'Serviço desativado', 'OK', { duration: 2000 });
    } catch (e) {
      this.snackBar.open('Erro ao alterar status', 'Fechar');
    }
  }
}