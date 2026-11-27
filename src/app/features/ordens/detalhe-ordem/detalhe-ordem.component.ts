import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { RoleSwitcherService } from '../../../core/services/role-switcher.service';
import { AuthService } from '../../../core/services/auth.service';
import { ServiceOrder, StatusOrdem, Endereco, Perfil } from '../../../core/models';
import { StatusColorPipe } from '../../../shared/pipes/status-color.pipe';
import { AvaliacaoDialogComponent } from '../../../shared/components/avaliacao-dialog.component';

@Component({
  selector: 'app-detalhe-ordem',
  standalone: true,
  imports: [
    CommonModule, RouterLink, StatusColorPipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatDividerModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatDialogModule
  ],
  template: `
    <div class="detalhe-ordem-page fade-in">
      <button mat-icon-button class="back-btn" routerLink="/ordens">
        <mat-icon>arrow_back</mat-icon>
      </button>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40" />
        </div>
      }

      @if (ordem(); as o) {
        <div class="ordem-header-section">
          <div class="header-left">
            <h1>{{ o.servicoTitulo }}</h1>
            <mat-chip [style.background]="o.status | statusColor" style="color: white;">
              {{ statusLabel(o.status) }}
            </mat-chip>
          </div>
          <div class="header-right">
            <span class="ordem-valor">R$ {{ o.valorTotal.toFixed(2) }}</span>
          </div>
        </div>

        <div class="ordem-grid">
          <!-- Coluna Principal -->
          <div class="ordem-main">
            <mat-card class="info-card">
              <mat-card-content>
                <h3>Detalhes da Ordem</h3>
                <mat-divider class="mb-2" />
                
                <div class="info-row">
                  <span class="label">Descrição:</span>
                  <p class="value">{{ o.descricao }}</p>
                </div>
                
                <div class="info-row">
                  <span class="label">Criada em:</span>
                  <span class="value">{{ o.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>

                @if (o.concluidoEm) {
                  <div class="info-row">
                    <span class="label">Concluída em:</span>
                    <span class="value">{{ o.concluidoEm | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                }

                @if (o.motivoCancelamento) {
                  <div class="info-row">
                    <span class="label">Motivo do cancelamento:</span>
                    <span class="value warn-text">{{ o.motivoCancelamento }}</span>
                  </div>
                }
              </mat-card-content>
            </mat-card>

            <!-- ENDEREÇO - REGRA LGPD -->
            @if (currentRole() === Perfil.PRESTADOR || currentRole() === Perfil.ADMIN) {
              <mat-card class="endereco-card">
                <mat-card-content>
                  <div class="endereco-header">
                    <mat-icon>location_on</mat-icon>
                    <h3>Endereço do Cliente</h3>
                  </div>
                  <mat-divider class="mb-2" />

                  <!-- Renderização condicional: só mostra se ACCEPTED -->
                  @if (o.status === StatusOrdem.ACCEPTED) {
                    <div class="endereco-info fade-in">
                      @if (endereco(); as e) {
                        <p><strong>Rua:</strong> {{ e.rua }}, {{ e.numero }}</p>
                        <p><strong>Bairro:</strong> {{ e.bairro }}</p>
                        <p><strong>Cidade:</strong> {{ e.cidade }} - {{ e.estado }}</p>
                        <p><strong>CEP:</strong> {{ e.cep }}</p>
                        @if (e.complemento) {
                          <p><strong>Complemento:</strong> {{ e.complemento }}</p>
                        }
                        <p class="endereco-aviso">
                          <mat-icon>lock</mat-icon> Visível apenas durante serviço aceito
                        </p>
                      }
                    </div>
                  } @else {
                    <!-- Endereço oculto -->
                    <div class="endereco-hidden">
                      <mat-icon class="hidden-icon">visibility_off</mat-icon>
                      <p class="hidden-text">
                        @if (o.status === StatusOrdem.REQUESTED) {
                          Endereço disponível apenas após aceitar a ordem
                        } @else {
                          Endereço não disponível para ordens {{ statusLabel(o.status).toLowerCase() }}
                        }
                      </p>
                    </div>
                  }
                </mat-card-content>
              </mat-card>
            }

            <!-- AVALIAÇÃO - Só aparece quando COMPLETED e é CLIENTE -->
            @if (o.status === StatusOrdem.COMPLETED && currentRole() === Perfil.CLIENTE) {
              <mat-card class="avaliacao-card">
                <mat-card-content>
                  <h3>Avaliar Serviço</h3>
                  <p>Deixe sua avaliação sobre este serviço</p>
                  <button mat-raised-button color="primary" (click)="avaliar()">
                    <mat-icon>star_rate</mat-icon> Avaliar
                  </button>
                </mat-card-content>
              </mat-card>
            }
          </div>

          <!-- Sidebar -->
          <div class="ordem-sidebar">
            <mat-card class="participantes-card">
              <mat-card-content>
                <h3>Participantes</h3>
                <mat-divider class="mb-2" />
                
                <div class="participante">
                  <mat-icon>person</mat-icon>
                  <div>
                    <span class="participante-label">Cliente</span>
                    <span class="participante-nome">{{ o.clienteNome }}</span>
                  </div>
                </div>

                <div class="participante">
                  <mat-icon>build</mat-icon>
                  <div>
                    <span class="participante-label">Prestador</span>
                    <span class="participante-nome">{{ o.prestadorNome }}</span>
                  </div>
                </div>

                <button mat-stroked-button class="w-100 mt-2" [routerLink]="['/ordem', o.id, 'chat']">
                  <mat-icon>chat</mat-icon> Conversar
                </button>

                <!-- 🔵 BOTÃO DE DENÚNCIA ADICIONADO -->
                <button mat-stroked-button color="warn" class="w-100 mt-2" (click)="denunciar()">
                  <mat-icon>report</mat-icon> Denunciar
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Ações rápidas -->
            <mat-card class="acoes-card">
              <mat-card-content>
                <h3>Ações</h3>
                <mat-divider class="mb-2" />

                @if (currentRole() === Perfil.PRESTADOR && o.status === StatusOrdem.REQUESTED) {
                  <button mat-flat-button color="primary" class="w-100 mb-1" (click)="alterarStatus(StatusOrdem.ACCEPTED)">
                    <mat-icon>check</mat-icon> Aceitar Ordem
                  </button>
                  <button mat-stroked-button color="warn" class="w-100" (click)="alterarStatus(StatusOrdem.CANCELED)">
                    <mat-icon>close</mat-icon> Recusar
                  </button>
                }

                @if (currentRole() === Perfil.PRESTADOR && o.status === StatusOrdem.ACCEPTED) {
                  <button mat-flat-button color="primary" class="w-100 mb-1" (click)="alterarStatus(StatusOrdem.COMPLETED)">
                    <mat-icon>done_all</mat-icon> Concluir Serviço
                  </button>
                  <button mat-stroked-button color="warn" class="w-100" (click)="alterarStatus(StatusOrdem.CANCELED)">
                    <mat-icon>cancel</mat-icon> Cancelar Serviço
                  </button>
                }

                @if (currentRole() === Perfil.CLIENTE && o.status === StatusOrdem.REQUESTED) {
                  <button mat-stroked-button color="warn" class="w-100" (click)="alterarStatus(StatusOrdem.CANCELED)">
                    <mat-icon>cancel</mat-icon> Cancelar Solicitação
                  </button>
                }

                @if (o.status === StatusOrdem.COMPLETED || o.status === StatusOrdem.CANCELED) {
                  <p class="status-final">
                    <mat-icon>info</mat-icon>
                    Ordem {{ statusLabel(o.status).toLowerCase() }} - ações indisponíveis
                  </p>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .detalhe-ordem-page { max-width: 1000px; margin: 0 auto; }
    .back-btn { margin-bottom: 16px; }

    .ordem-header-section {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 32px;

      .header-left {
        h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
      }
      .ordem-valor { font-size: 28px; font-weight: 700; color: #2e7d32; }
    }

    .ordem-grid {
      display: grid; grid-template-columns: 1fr 320px; gap: 24px;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .info-card, .endereco-card, .participantes-card, .acoes-card, .avaliacao-card {
      border-radius: 12px; margin-bottom: 24px;

      h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
    }

    .info-row {
      margin-bottom: 16px;
      .label { display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; }
      .value { font-size: 14px; margin: 0; }
      .warn-text { color: var(--warn); }
    }

    .endereco-header {
      display: flex; align-items: center; gap: 8px;
      mat-icon { color: var(--primary); }
    }

    .endereco-info {
      p { margin-bottom: 8px; font-size: 14px; }
      .endereco-aviso {
        display: flex; align-items: center; gap: 4px;
        font-size: 12px; color: var(--text-secondary); margin-top: 16px;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
    }

    .endereco-hidden {
      text-align: center; padding: 24px 0;
      .hidden-icon { font-size: 48px; width: 48px; height: 48px; color: #ddd; margin-bottom: 12px; }
      .hidden-text { font-size: 14px; color: var(--text-secondary); }
    }

    .participante {
      display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
      mat-icon { color: var(--primary); }
      .participante-label { display: block; font-size: 12px; color: var(--text-secondary); }
      .participante-nome { font-weight: 500; font-size: 14px; }
    }

    .status-final {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--text-secondary); margin: 0;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .loading-container { display: flex; justify-content: center; padding: 60px 0; }

    .avaliacao-card {
      text-align: center;
      p { color: var(--text-secondary); margin-bottom: 16px; }
    }
  `]
})
export class DetalheOrdemComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(DadosMockService);
  private roleSwitcher = inject(RoleSwitcherService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  StatusOrdem = StatusOrdem;
  Perfil = Perfil;
  ordem = signal<ServiceOrder | null>(null);
  endereco = signal<Endereco | null>(null);
  loading = signal(true);
  currentRole = this.roleSwitcher.currentRole;

  async ngOnInit() {
    this.carregarOrdem();
  }

  async carregarOrdem() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      const o = await this.mockService.getOrdemById(id);
      this.ordem.set(o);
      
      if (o.status === StatusOrdem.ACCEPTED && (this.currentRole() === Perfil.PRESTADOR || this.currentRole() === Perfil.ADMIN)) {
        await this.carregarEndereco(o);
      }
    } catch (e: any) {
      this.snackBar.open(e?.message || 'Ordem não encontrada', 'Fechar');
      this.router.navigate(['/ordens']);
    } finally {
      this.loading.set(false);
    }
  }

  async carregarEndereco(ordem: ServiceOrder) {
    try {
      const end = await this.mockService.getEnderecoCliente(ordem.clienteId, ordem.prestadorId);
      this.endereco.set(end);
    } catch (e: any) {
      this.endereco.set(null);
    }
  }

  statusLabel(status: StatusOrdem): string {
    const labels: Record<string, string> = {
      'REQUESTED': 'Solicitado', 'ACCEPTED': 'Aceito',
      'COMPLETED': 'Concluído', 'CANCELED': 'Cancelado'
    };
    return labels[status] || status;
  }

  async alterarStatus(novoStatus: StatusOrdem) {
    const o = this.ordem();
    if (!o) return;

    try {
      const usuarioId = this.authService.getCurrentUserId();
      const updated = await this.mockService.atualizarStatusOrdem(o.id, novoStatus, usuarioId);
      this.ordem.set(updated);
      this.snackBar.open('Status atualizado com sucesso!', 'OK', { duration: 3000 });
      
      if (novoStatus === StatusOrdem.ACCEPTED) {
        await this.carregarEndereco(updated);
      } else {
        this.endereco.set(null);
      }
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Erro ao atualizar status', 'Fechar', { 
        duration: 5000, panelClass: 'error-snack' 
      });
    }
  }

  avaliar() {
    const ordem = this.ordem();
    if (!ordem) return;

    const dialogRef = this.dialog.open(AvaliacaoDialogComponent, {
      width: '500px',
      data: { 
        ordemId: ordem.id,
        servicoTitulo: ordem.servicoTitulo 
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.mockService.avaliarOrdem(ordem.id, result.nota, result.comentario);
          this.snackBar.open('Avaliação enviada! Obrigado!', 'OK', { duration: 3000 });
        } catch (error) {
          this.snackBar.open('Erro ao enviar avaliação', 'Fechar');
        }
      }
    });
  }

  // 🔵 MÉTODO DE DENÚNCIA ADICIONADO
  async denunciar() {
    const ordem = this.ordem();
    if (!ordem) return;

    const motivo = prompt('Motivo da denúncia:', '');
    if (!motivo) return;

    const descricao = prompt('Descreva o ocorrido detalhadamente:', '');
    if (!descricao) return;

    try {
      const usuarioId = this.authService.getCurrentUserId();
      const denunciadoId = this.currentRole() === Perfil.CLIENTE 
        ? ordem.prestadorId   // Cliente denuncia prestador
        : ordem.clienteId;    // Prestador denuncia cliente

      await this.mockService.criarDenuncia({
        ordemId: ordem.id,
        denuncianteId: usuarioId,
        denunciadoId: denunciadoId,
        motivo: motivo,
        descricao: descricao
      });
      
      this.snackBar.open('Denúncia enviada com sucesso! A equipe irá analisar.', 'OK', { duration: 4000 });
    } catch (error) {
      this.snackBar.open('Erro ao enviar denúncia. Tente novamente.', 'Fechar');
    }
  }
}