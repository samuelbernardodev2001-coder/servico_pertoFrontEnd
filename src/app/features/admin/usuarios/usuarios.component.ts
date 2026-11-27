import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { Usuario, PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatSlideToggleModule,
    MatPaginatorModule, MatSnackBarModule
  ],
  template: `
    <div class="usuarios-page fade-in">
      <h1>Usuários</h1>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="usuarios()" class="w-100">
            <ng-container matColumnDef="foto">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let u">
                <img [src]="u.fotoUrl" class="avatar" alt="">
              </td>
            </ng-container>

            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let u">{{ u.nome }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let u">{{ u.email }}</td>
            </ng-container>

            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let u">
                <mat-chip [style.background]="tipoColor(u.tipo)" style="color:white; font-size:12px;">
                  {{ tipoLabel(u.tipo) }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="ativo">
              <th mat-header-cell *matHeaderCellDef>Ativo</th>
              <td mat-cell *matCellDef="let u">
                <mat-slide-toggle [checked]="u.ativo" (change)="toggleAtivo(u.id)" />
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="colunas"></tr>
            <tr mat-row *matRowDef="let row; columns: colunas;" [class.inactive-row]="!row.ativo"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-paginator
        [length]="totalElementos()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .usuarios-page { max-width: 900px; margin: 0 auto; h1 { font-size:28px; font-weight:700; margin-bottom:24px; } }
    .avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
    .inactive-row { opacity: 0.4; }
  `]
})
export class UsuariosComponent implements OnInit {
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);

  usuarios = signal<Usuario[]>([]);
  totalElementos = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);
  colunas = ['foto', 'nome', 'email', 'tipo', 'ativo'];

  async ngOnInit() {
    await this.carregarUsuarios();
  }

  async carregarUsuarios() {
    try {
      const result = await this.mockService.listarUsuarios(this.currentPage(), this.pageSize(), true);
      this.usuarios.set(result.content);
      this.totalElementos.set(result.totalElements);
    } catch (e) {
      this.snackBar.open('Erro ao carregar usuários', 'Fechar');
    }
  }

  async toggleAtivo(userId: string) {
    try {
      const updated = await this.mockService.toggleUsuarioAtivo(userId);
      this.usuarios.update(list => list.map(u => u.id === userId ? updated : u));
      this.snackBar.open(updated.ativo ? 'Usuário ativado' : 'Usuário desativado', 'OK', { duration: 3000 });
    } catch (e) {
      this.snackBar.open('Erro ao alterar status', 'Fechar');
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarUsuarios();
  }

  tipoColor(tipo: string): string {
    const colors: Record<string, string> = { 'CLIENTE': '#2196f3', 'PRESTADOR': '#4caf50', 'ADMIN': '#9c27b0' };
    return colors[tipo] || '#999';
  }

  tipoLabel(tipo: string): string {
    const labels: Record<string, string> = { 'CLIENTE': 'Cliente', 'PRESTADOR': 'Prestador', 'ADMIN': 'Admin' };
    return labels[tipo] || tipo;
  }
}