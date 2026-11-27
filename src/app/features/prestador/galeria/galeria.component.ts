import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { Servico } from '../../../core/models';

const MAX_IMAGENS = 5;

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="galeria-page fade-in">
      <button mat-icon-button class="back-btn" (click)="voltar()">
        <mat-icon>arrow_back</mat-icon>
      </button>

      <h1>Galeria de Fotos</h1>
      <p class="subtitle" *ngIf="servico() as s">{{ s.titulo }} - Máximo {{ MAX_IMAGENS }} imagens</p>

      <div class="galeria-grid">
        @for (img of servico()?.imagensUrls; track img; let i = $index) {
          <div class="galeria-item">
            <img [src]="img" alt="Foto {{ i+1 }}">
            <button class="remove-img" mat-mini-fab color="warn" (click)="removerImagem(i)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        }

        @if ((servico()?.imagensUrls?.length || 0) < MAX_IMAGENS) {
          <div class="add-image-card" (click)="adicionarImagem()">
            <mat-icon>add_a_photo</mat-icon>
            <span>Adicionar foto</span>
            <span class="count">{{ (servico()?.imagensUrls?.length || 0) }}/{{ MAX_IMAGENS }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .galeria-page { max-width: 800px; margin: 0 auto; }
    .back-btn { margin-bottom: 16px; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .subtitle { color: var(--text-secondary); margin-bottom: 24px; }

    .galeria-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .galeria-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4/3;
      
      img { width: 100%; height: 100%; object-fit: cover; }
      
      .remove-img {
        position: absolute;
        top: 8px; right: 8px;
        width: 32px; height: 32px;
        mat-icon { font-size: 16px; }
      }
    }

    .add-image-card {
      border: 2px dashed #ccc;
      border-radius: 12px;
      aspect-ratio: 4/3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      color: #999;

      &:hover {
        border-color: var(--primary);
        color: var(--primary);
        background: rgba(63,81,181,0.05);
      }

      mat-icon { font-size: 48px; width: 48px; height: 48px; }
      .count { font-size: 12px; font-weight: 600; }
    }
  `]
})
export class GaleriaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);

  MAX_IMAGENS = MAX_IMAGENS;
  servico = signal<Servico | null>(null);

  async ngOnInit() {
    const servicoId = this.route.snapshot.paramMap.get('servicoId')!;
    try {
      const s = await this.mockService.getServicoById(servicoId);
      this.servico.set(s);
    } catch (e) {
      this.snackBar.open('Serviço não encontrado', 'Fechar');
      this.router.navigate(['/prestador/servicos']);
    }
  }

  async removerImagem(index: number) {
    const s = this.servico();
    if (!s) return;
    const novasUrls = s.imagensUrls.filter((_, i) => i !== index);
    try {
      const updated = await this.mockService.atualizarServico(s.id, { imagensUrls: novasUrls });
      this.servico.set(updated);
      this.snackBar.open('Imagem removida', 'OK', { duration: 2000 });
    } catch (e) {
      this.snackBar.open('Erro ao remover imagem', 'Fechar');
    }
  }

  adicionarImagem() {
    const s = this.servico();
    if (!s || s.imagensUrls.length >= MAX_IMAGENS) return;

    // Simula upload com URL do picsum
    const url = prompt('URL da imagem (ou deixe em branco para gerar automática):');
    const novaUrl = url?.trim() || `https://picsum.photos/seed/${Date.now()}/400/300`;
    
    if (novaUrl) {
      this.mockService.atualizarServico(s.id, {
        imagensUrls: [...s.imagensUrls, novaUrl]
      }).then(updated => {
        this.servico.set(updated);
        this.snackBar.open('Imagem adicionada!', 'OK', { duration: 2000 });
      });
    }
  }

  voltar() {
    this.router.navigate(['/prestador/servicos']);
  }
}