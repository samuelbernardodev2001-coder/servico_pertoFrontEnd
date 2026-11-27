import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DadosMockService } from '../../core/services/dados-mock.service';
import { RoleSwitcherService } from '../../core/services/role-switcher.service';
import { Servico, Categoria } from '../../core/models';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="vitrine-page fade-in">
      <header class="vitrine-header">
        <h1>Serviços Disponíveis</h1>
        <p>Encontre o profissional ideal para seu projeto</p>
      </header>

      <!-- Filtros -->
      <div class="filtros-card">
        <div class="filtros-grid">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar serviços</mat-label>
            <input matInput [(ngModel)]="busca" (input)="onSearch()" placeholder="O que você precisa?">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Categoria</mat-label>
            <mat-select [(ngModel)]="categoriaFiltro" (ngModelChange)="onFilterChange()">
              <mat-option value="">Todas</mat-option>
              @for (cat of categorias(); track cat.id) {
                <mat-option [value]="cat.id">
                  <mat-icon>{{ cat.icone }}</mat-icon> {{ cat.nome }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40" />
          <p>Carregando serviços...</p>
        </div>
      }

      <!-- Grid de Serviços -->
      @if (!loading() && servicos().length > 0) {
        <div class="servicos-grid">
          @for (servico of servicos(); track servico.id) {
            <mat-card class="servico-card" [routerLink]="['/servico', servico.id]">
              <div class="card-image">
                @if (servico.imagensUrls.length > 0) {
                  <img [src]="servico.imagensUrls[0]" [alt]="servico.titulo" loading="lazy">
                } @else {
                  <div class="no-image">
                    <mat-icon>image</mat-icon>
                  </div>
                }
                <button class="favorite-btn" (click)="toggleFavorito($event, servico.id)"
                        [class.favorited]="favoritosMap()[servico.id]"
                        mat-icon-button>
                  <mat-icon>{{ favoritosMap()[servico.id] ? 'favorite' : 'favorite_border' }}</mat-icon>
                </button>
              </div>
              
              <mat-card-content>
                <div class="card-categoria">
                  <mat-icon>folder</mat-icon>
                  <span>{{ servico.categoriaNome }}</span>
                </div>
                
                <h3 class="card-titulo">{{ servico.titulo }}</h3>
                
                <div class="card-prestador">
                  <img [src]="servico.prestadorFotoUrl" alt="" class="prestador-avatar">
                  <span>{{ servico.prestadorNome }}</span>
                </div>

                <div class="card-footer">
                  <div class="card-rating">
                    <mat-icon class="star-icon">star</mat-icon>
                    <span class="rating-value">{{ servico.mediaAvaliacao.toFixed(1) }}</span>
                    <span class="rating-count">({{ servico.totalAvaliacoes }})</span>
                  </div>
                  <div class="card-preco">
                    <span class="preco-label">a partir de</span>
                    <span class="preco-value">R$ {{ servico.preco.toFixed(2) }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>

        <!-- Paginação -->
        @if (totalElementos() > 20) {
          <mat-paginator
            [length]="totalElementos()"
            [pageSize]="pageSize()"
            [pageIndex]="currentPage()"
            [pageSizeOptions]="[12, 20, 40]"
            (page)="onPageChange($event)"
            showFirstLastButtons
            aria-label="Paginação de serviços">
          </mat-paginator>
        }
      }

      <!-- Empty state -->
      @if (!loading() && servicos().length === 0) {
        <div class="empty-state">
          <mat-icon class="empty-icon">search_off</mat-icon>
          <h2>Nenhum serviço encontrado</h2>
          <p>Tente ajustar os filtros ou buscar por outro termo</p>
          <button mat-stroked-button (click)="limparFiltros()">Limpar Filtros</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .vitrine-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .vitrine-header {
      text-align: center;
      margin-bottom: 32px;

      h1 {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 8px;
      }

      p {
        color: var(--text-secondary);
        font-size: 16px;
      }
    }

    .filtros-card {
      background: var(--surface);
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px var(--shadow);
    }

    .filtros-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
      
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .servicos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .servico-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 12px;
      overflow: hidden;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      .card-image {
        position: relative;
        height: 180px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          color: #bbb;
          font-size: 48px;
        }

        .favorite-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255,255,255,0.9);
          
          &.favorited {
            color: #e91e63;
          }
        }
      }

      .card-categoria {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--primary);
        margin-bottom: 8px;

        mat-icon { font-size: 16px; width: 16px; height: 16px; }
      }

      .card-titulo {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 12px;
        line-height: 1.3;
      }

      .card-prestador {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        color: var(--text-secondary);

        .prestador-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .card-rating {
          display: flex;
          align-items: center;
          gap: 4px;

          .star-icon {
            color: #ffc107;
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
          .rating-value { font-weight: 600; font-size: 14px; }
          .rating-count { color: var(--text-secondary); font-size: 13px; }
        }

        .card-preco {
          text-align: right;

          .preco-label {
            display: block;
            font-size: 11px;
            color: var(--text-secondary);
          }
          .preco-value {
            font-size: 20px;
            font-weight: 700;
            color: #2e7d32;
          }
        }
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px 0;
      color: var(--text-secondary);
    }

    .empty-state {
      text-align: center;
      padding: 60px 0;
      
      .empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
        margin-bottom: 16px;
      }

      h2 { color: var(--text-secondary); margin-bottom: 8px; }
      p { color: #999; margin-bottom: 24px; }
    }
  `]
})
export class VitrineComponent implements OnInit {
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);
  private roleSwitcher = inject(RoleSwitcherService);

  servicos = signal<Servico[]>([]);
  categorias = signal<Categoria[]>([]);
  favoritosMap = signal<Record<string, boolean>>({});
  loading = signal(true);

  busca = '';
  categoriaFiltro = '';
  currentPage = signal(0);
  pageSize = signal(20);
  totalElementos = signal(0);

  async ngOnInit() {
    await this.carregarCategorias();
    await this.carregarServicos();
    await this.carregarFavoritos();
  }

  async carregarCategorias() {
    try {
      const cats = await this.mockService.listarCategoriasTodas();
      this.categorias.set(cats.filter(c => c.ativa));
    } catch (e) {
      console.error('Erro ao carregar categorias', e);
    }
  }

  async carregarServicos() {
    this.loading.set(true);
    try {
      const result = await this.mockService.listarServicos(
        this.currentPage(), this.pageSize(),
        this.categoriaFiltro || undefined,
        this.busca || undefined
      );
      this.servicos.set(result.content);
      this.totalElementos.set(result.totalElements);
    } catch (e) {
      this.snackBar.open('Erro ao carregar serviços', 'Fechar', { panelClass: 'error-snack' });
    } finally {
      this.loading.set(false);
    }
  }

  async carregarFavoritos() {
    try {
      if (!this.roleSwitcher.isCliente()) return;
      const favs = await this.mockService.listarFavoritos();
      const map: Record<string, boolean> = {};
      favs.forEach(f => map[f.servicoId] = true);
      this.favoritosMap.set(map);
    } catch (e) {}
  }

  async toggleFavorito(event: MouseEvent, servicoId: string) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.roleSwitcher.isCliente()) {
      this.snackBar.open('Apenas clientes podem favoritar', 'OK', { duration: 2000 });
      return;
    }
    try {
      await this.mockService.toggleFavorito(servicoId);
      await this.carregarFavoritos();
      this.snackBar.open(
        this.favoritosMap()[servicoId] ? 'Adicionado aos favoritos!' : 'Removido dos favoritos',
        'OK', { duration: 2000 }
      );
    } catch (e) {
      this.snackBar.open('Erro ao favoritar', 'Fechar');
    }
  }

  private searchTimeout: any;

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(0);
      this.carregarServicos();
    }, 400);
  }

  onFilterChange() {
    this.currentPage.set(0);
    this.carregarServicos();
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarServicos();
  }

  limparFiltros() {
    this.busca = '';
    this.categoriaFiltro = '';
    this.currentPage.set(0);
    this.carregarServicos();
  }
}