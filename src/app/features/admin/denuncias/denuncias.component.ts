import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { Denuncia, StatusDenuncia, PaginatedResponse } from '../../../core/models';
import { DenunciaListComponent } from './denuncia-list.component.js';

@Component({
  selector: 'app-denuncias',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatChipsModule, 
    MatTabsModule, 
    MatDividerModule,
    MatDialogModule, 
    MatSnackBarModule, 
    MatPaginatorModule,
    MatFormFieldModule, 
    MatInputModule,
    DenunciaListComponent 
  ],
  template: `
    <div class="denuncias-page fade-in">
      <h1>Moderação de Denúncias</h1>

      <mat-tab-group (selectedTabChange)="onTabChange($event.index)">
        <mat-tab label="Todas">
          <ng-template matTabContent>
            <denuncia-list [denuncias]="denuncias()" [onModerar]="moderar.bind(this)" />
          </ng-template>
        </mat-tab>
        <mat-tab label="Pendentes">
          <ng-template matTabContent>
            <denuncia-list [denuncias]="filtrarStatus(StatusDenuncia.PENDENTE)" [onModerar]="moderar.bind(this)" />
          </ng-template>
        </mat-tab>
        <mat-tab label="Resolvidas">
          <ng-template matTabContent>
            <denuncia-list [denuncias]="filtrarStatus(StatusDenuncia.RESOLVIDA)" [onModerar]="moderar.bind(this)" />
          </ng-template>
        </mat-tab>
        <mat-tab label="Rejeitadas">
          <ng-template matTabContent>
            <denuncia-list [denuncias]="filtrarStatus(StatusDenuncia.REJEITADA)" [onModerar]="moderar.bind(this)" />
          </ng-template>
        </mat-tab>
      </mat-tab-group>

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
    .denuncias-page { 
      max-width: 1000px; 
      margin: 0 auto; 
    }
    h1 { 
      font-size: 28px; 
      font-weight: 700; 
      margin-bottom: 24px; 
    }
  `]
})
export class DenunciasComponent implements OnInit {
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);

  // Expoe enum para o template
  StatusDenuncia = StatusDenuncia;

  denuncias = signal<Denuncia[]>([]);
  totalElementos = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);
  filtroStatus = signal<StatusDenuncia | undefined>(undefined);

  async ngOnInit() {
    await this.carregarDenuncias();
  }

  async carregarDenuncias() {
    try {
      const result = await this.mockService.listarDenuncias(
        this.currentPage(), this.pageSize(), this.filtroStatus()
      );
      this.denuncias.set(result.content);
      this.totalElementos.set(result.totalElements);
    } catch (e) {
      this.snackBar.open('Erro ao carregar denúncias', 'Fechar');
    }
  }

  // Corrigido para usar o enum StatusDenuncia
  filtrarStatus(status: StatusDenuncia): Denuncia[] {
    return this.denuncias().filter(d => d.status === status);
  }

  onTabChange(index: number) {
    const statuses = [undefined, StatusDenuncia.PENDENTE, StatusDenuncia.RESOLVIDA, StatusDenuncia.REJEITADA];
    this.filtroStatus.set(statuses[index] as StatusDenuncia | undefined);
    this.currentPage.set(0);
    this.carregarDenuncias();
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarDenuncias();
  }

  async moderar(denunciaId: string, status: StatusDenuncia, observacao: string) {
    try {
      await this.mockService.moderarDenuncia(denunciaId, status, observacao);
      this.snackBar.open('Denúncia moderada com sucesso!', 'OK', { duration: 3000 });
      await this.carregarDenuncias();
    } catch (e: any) {
      this.snackBar.open(e?.message || 'Erro ao moderar', 'Fechar');
    }
  }
}