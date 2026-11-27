// src/app/features/vitrine/detalhe-servico/detalhe-servico.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { RoleSwitcherService } from '../../../core/services/role-switcher.service';
import { Servico } from '../../../core/models';
import { ContratarDialogComponent } from './contratar-dialog.component';

@Component({
  selector: 'app-detalhe-servico',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatDividerModule,
    MatSnackBarModule, MatDialogModule
  ],
  template: `
    <div class="detalhe-page fade-in">
      @if (loading()) {
        <div class="loading">Carregando...</div>
      }

      @if (servico(); as s) {
        <button mat-icon-button class="back-btn" routerLink="/vitrine">
          <mat-icon>arrow_back</mat-icon>
        </button>

        <div class="detalhe-grid">
          <div class="detalhe-gallery">
            <div class="main-image">
              <img [src]="selectedImage()" [alt]="s.titulo">
            </div>
            @if (s.imagensUrls.length > 1) {
              <div class="thumbnails">
                @for (img of s.imagensUrls; track img) {
                  <button class="thumb" [class.active]="img === selectedImage()" (click)="selectedImage.set(img)">
                    <img [src]="img" alt="">
                  </button>
                }
              </div>
            }
          </div>

          <div class="detalhe-info">
            <div class="info-header">
              <div class="categoria-badge">
                <mat-icon>folder</mat-icon> {{ s.categoriaNome }}
              </div>
              <h1>{{ s.titulo }}</h1>
            </div>

            <div class="prestador-info">
              <img [src]="s.prestadorFotoUrl" alt="" class="avatar-lg">
              <div>
                <span class="prestador-nome">{{ s.prestadorNome }}</span>
                <div class="rating">
                  <mat-icon>star</mat-icon>
                  <span>{{ s.mediaAvaliacao.toFixed(1) }}</span>
                  <span>({{ s.totalAvaliacoes }} avaliações)</span>
                </div>
              </div>
            </div>

            <mat-divider />

            <div class="descricao-section">
              <h3>Descrição</h3>
              <p>{{ s.descricao }}</p>
            </div>

            <mat-divider />

            <div class="preco-section">
              <div class="preco-tag">R$ {{ s.preco.toFixed(2) }}</div>
              <p class="preco-info">Preço fixo para este serviço</p>
            </div>

            <button mat-flat-button color="primary" class="contratar-btn"
                    (click)="contratar()"
                    [disabled]="!isCliente()">
              <mat-icon>handshake</mat-icon>
              {{ isCliente() ? 'Solicitar este serviço' : 'Faça login como cliente' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .detalhe-page { max-width: 1000px; margin: 0 auto; position: relative; }
    .back-btn { margin-bottom: 16px; }
    
    .detalhe-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    .main-image {
      border-radius: 12px;
      overflow: hidden;
      img { width: 100%; height: 350px; object-fit: cover; display: block; }
    }

    .thumbnails {
      display: flex;
      gap: 8px;
      margin-top: 12px;

      .thumb {
        width: 80px;
        height: 60px;
        border: 2px solid transparent;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        padding: 0;

        &.active { border-color: var(--primary); }
        img { width: 100%; height: 100%; object-fit: cover; }
      }
    }

    .detalhe-info {
      .categoria-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: #e3f2fd;
        color: var(--primary);
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 13px;
        margin-bottom: 12px;

        mat-icon { font-size: 16px; width: 16px; height: 16px; }
      }

      h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 24px;
        line-height: 1.2;
      }
    }

    .prestador-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      .avatar-lg {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        object-fit: cover;
      }

      .prestador-nome {
        font-weight: 600;
        font-size: 16px;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        mat-icon { color: #ffc107; font-size: 18px; width: 18px; height: 18px; }
      }
    }

    .descricao-section {
      margin: 24px 0;
      h3 { font-weight: 600; margin-bottom: 8px; font-size: 16px; }
      p { line-height: 1.7; color: var(--text-secondary); }
    }

    .preco-section {
      margin: 24px 0;
      
      .preco-tag {
        font-size: 32px;
        font-weight: 700;
        color: #2e7d32;
      }
      .preco-info { color: var(--text-secondary); font-size: 14px; }
    }

    .contratar-btn {
      width: 100%;
      padding: 24px;
      font-size: 16px;
      margin-top: 16px;
    }
  `]
})
export class DetalheServicoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);
  private roleSwitcher = inject(RoleSwitcherService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  servico = signal<Servico | null>(null);
  selectedImage = signal('');
  loading = signal(true);

  // 🔵 CORRIGIDO - Chamar o método do service corretamente
  isCliente(): boolean {
    return this.roleSwitcher.isCliente();
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      const s = await this.mockService.getServicoById(id);
      this.servico.set(s);
      this.selectedImage.set(s.imagensUrls[0] || '');
    } catch (e) {
      this.snackBar.open('Serviço não encontrado', 'Fechar');
      this.router.navigate(['/vitrine']);
    } finally {
      this.loading.set(false);
    }
  }

  async contratar() {
    const s = this.servico();
    if (!s || !this.roleSwitcher.isCliente()) return;

    const dialogRef = this.dialog.open(ContratarDialogComponent, {
      width: '500px',
      data: { servico: s }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const ordem = await this.mockService.criarOrdem({
            servicoId: s.id,
            prestadorId: s.prestadorId,
            descricao: result.descricao,
            valorTotal: s.preco
          });
          this.snackBar.open('Serviço solicitado com sucesso!', 'Ver Ordem');
          this.router.navigate(['/ordem', ordem.id]);
        } catch (e) {
          this.snackBar.open('Erro ao solicitar serviço', 'Fechar');
        }
      }
    });
  }
}