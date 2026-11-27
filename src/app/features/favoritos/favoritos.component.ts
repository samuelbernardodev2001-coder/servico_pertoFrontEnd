import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DadosMockService } from '../../core/services/dados-mock.service';
import { Favorito } from '../../core/models';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="favoritos-page fade-in">
      <h1>Meus Favoritos</h1>

      @if (favoritos().length === 0) {
        <div class="empty-state">
          <mat-icon>favorite_border</mat-icon>
          <h2>Nenhum favorito ainda</h2>
          <p>Explore serviços e favorite os que mais gostar</p>
          <button mat-raised-button color="primary" routerLink="/vitrine">
            <mat-icon>storefront</mat-icon> Ver Serviços
          </button>
        </div>
      }

      <div class="favoritos-grid">
        @for (fav of favoritos(); track fav.id) {
          <mat-card class="fav-card" [routerLink]="['/servico', fav.servico.id]">
            <div class="card-image">
              @if (fav.servico.imagensUrls.length > 0) {
                <img [src]="fav.servico.imagensUrls[0]" [alt]="fav.servico.titulo" loading="lazy">
              } @else {
                <div class="no-image"><mat-icon>image</mat-icon></div>
              }
              <button class="remove-btn" (click)="remover($event, fav.servicoId)" mat-icon-button>
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <mat-card-content>
              <h3>{{ fav.servico.titulo }}</h3>
              <p class="prestador">{{ fav.servico.prestadorNome }}</p>
              <div class="card-footer">
                <span class="rating">
                  <mat-icon>star</mat-icon> {{ fav.servico.mediaAvaliacao.toFixed(1) }}
                </span>
                <span class="preco">R$ {{ fav.servico.preco.toFixed(2) }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .favoritos-page { max-width: 1000px; margin: 0 auto; }
    
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 24px; }

    .empty-state {
      text-align: center; padding: 60px 20px;
      mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ddd; margin-bottom: 16px; }
      h2 { color: var(--text-secondary); margin-bottom: 8px; }
      p { color: #999; margin-bottom: 24px; }
    }

    .favoritos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .fav-card { cursor: pointer; border-radius: 12px; overflow: hidden;
      &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }

      .card-image {
        position: relative; height: 150px; overflow: hidden;
        img { width: 100%; height: 100%; object-fit: cover; }
        .no-image { height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #bbb; }
        .remove-btn { position: absolute; top: 4px; right: 4px; background: rgba(255,255,255,0.9); color: var(--warn); }
      }

      h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
      .prestador { font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; }

      .card-footer {
        display: flex; justify-content: space-between; align-items: center;
        .rating { display: flex; align-items: center; gap: 4px; font-size: 13px; mat-icon { color: #ffc107; font-size: 16px; width: 16px; height: 16px; } }
        .preco { font-size: 18px; font-weight: 700; color: #2e7d32; }
      }
    }
  `]
})
export class FavoritosComponent implements OnInit {
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);
  
  favoritos = signal<Favorito[]>([]);

  async ngOnInit() {
    try {
      const favs = await this.mockService.listarFavoritos();
      this.favoritos.set(favs);
    } catch (e) {
      this.snackBar.open('Erro ao carregar favoritos', 'Fechar');
    }
  }

  async remover(event: MouseEvent, servicoId: string) {
    event.stopPropagation();
    event.preventDefault();
    try {
      await this.mockService.toggleFavorito(servicoId);
      this.favoritos.set(this.favoritos().filter(f => f.servicoId !== servicoId));
      this.snackBar.open('Removido dos favoritos', 'OK', { duration: 2000 });
    } catch (e) {
      this.snackBar.open('Erro ao remover favorito', 'Fechar');
    }
  }
}