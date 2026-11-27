import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { Categoria } from '../../../core/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatSlideToggleModule,
    MatDividerModule, MatSnackBarModule
  ],
  template: `
    <div class="categorias-page fade-in">
      <div class="page-header">
        <h1>Gestão de Categorias</h1>
        <button mat-raised-button color="primary" (click)="novaCategoria()">
          <mat-icon>add</mat-icon> Nova Categoria
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="categorias()" class="w-100">
            <ng-container matColumnDef="icone">
              <th mat-header-cell *matHeaderCellDef>Ícone</th>
              <td mat-cell *matCellDef="let c"><mat-icon>{{ c.icone }}</mat-icon></td>
            </ng-container>

            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let c">{{ c.nome }}</td>
            </ng-container>

            <ng-container matColumnDef="descricao">
              <th mat-header-cell *matHeaderCellDef>Descrição</th>
              <td mat-cell *matCellDef="let c">{{ c.descricao }}</td>
            </ng-container>

            <ng-container matColumnDef="criadoEm">
              <th mat-header-cell *matHeaderCellDef>Criada em</th>
              <td mat-cell *matCellDef="let c">{{ c.criadoEm | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <ng-container matColumnDef="ativa">
              <th mat-header-cell *matHeaderCellDef>Ativa</th>
              <td mat-cell *matCellDef="let c">
                <mat-slide-toggle [checked]="c.ativa" (change)="toggleAtiva(c.id, $event.checked)" />
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="colunas"></tr>
            <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .categorias-page { max-width: 900px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; h1 { font-size:28px; font-weight:700; margin:0; } }
    table { width: 100%; }
    mat-icon { color: var(--primary); }
  `]
})
export class CategoriasComponent implements OnInit {
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);

  categorias = signal<Categoria[]>([]);
  colunas = ['icone', 'nome', 'descricao', 'criadoEm', 'ativa'];

  async ngOnInit() {
    try {
      const cats = await this.mockService.listarCategoriasTodas();
      this.categorias.set(cats);
    } catch (e) {
      this.snackBar.open('Erro ao carregar categorias', 'Fechar');
    }
  }

  novaCategoria() {
    const nome = prompt('Nome da nova categoria:');
    if (nome) {
      const icone = prompt('Ícone (Material Icons):') || 'category';
      this.mockService.criarCategoria({ nome, icone, descricao: '', ativa: true }).then(c => {
        this.categorias.update(list => [...list, c]);
        this.snackBar.open('Categoria criada!', 'OK', { duration: 2000 });
      });
    }
  }

  async toggleAtiva(id: string, ativa: boolean) {
    try {
      await this.mockService.atualizarCategoria(id, { ativa });
      this.categorias.update(list => list.map(c => c.id === id ? { ...c, ativa } : c));
      this.snackBar.open(ativa ? 'Categoria ativada' : 'Categoria desativada', 'OK', { duration: 2000 });
    } catch (e) {
      this.snackBar.open('Erro ao alterar categoria', 'Fechar');
    }
  }
}