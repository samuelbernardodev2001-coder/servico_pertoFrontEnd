import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DadosMockService } from '../../core/services/dados-mock.service.js';
import { RoleSwitcherService } from '../../core/services/role-switcher.service.js';
import { ServiceOrder, StatusOrdem, Perfil } from '../../core/models';
import { OrdemListComponent } from './ordem-list/ordem-list.component.js';

@Component({
  selector: 'app-ordens',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatSnackBarModule,
    OrdemListComponent
  ],
  template: `
    <div class="ordens-page fade-in">
      <h1>Minhas Ordens de Serviço</h1>

      <mat-tab-group (selectedTabChange)="onTabChange($event.index)">
        <mat-tab label="Todas">
          <ng-template matTabContent>
            <ordem-list [ordens]="filtrarPorStatus()" [role]="currentRole()" (statusChanged)="carregarOrdens()" />
          </ng-template>
        </mat-tab>
        <mat-tab label="Solicitadas">
          <ng-template matTabContent>
            <ordem-list [ordens]="filtrarPorStatus(StatusOrdem.REQUESTED)" [role]="currentRole()" (statusChanged)="carregarOrdens()" />
          </ng-template>
        </mat-tab>
        <mat-tab label="Aceitas">
          <ng-template matTabContent>
            <ordem-list [ordens]="filtrarPorStatus(StatusOrdem.ACCEPTED)" [role]="currentRole()" (statusChanged)="carregarOrdens()" />
          </ng-template>
        </mat-tab>
        <mat-tab label="Concluídas">
          <ng-template matTabContent>
            <ordem-list [ordens]="filtrarPorStatus(StatusOrdem.COMPLETED)" [role]="currentRole()" (statusChanged)="carregarOrdens()" />
          </ng-template>
        </mat-tab>
        <mat-tab label="Canceladas">
          <ng-template matTabContent>
            <ordem-list [ordens]="filtrarPorStatus(StatusOrdem.CANCELED)" [role]="currentRole()" (statusChanged)="carregarOrdens()" />
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .ordens-page {
      max-width: 900px;
      margin: 0 auto;
      
      h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 24px;
      }
    }
  `]
})
export class OrdensComponent implements OnInit {
  private mockService = inject(DadosMockService);
  private roleSwitcher = inject(RoleSwitcherService);

  StatusOrdem = StatusOrdem;
  ordens = signal<ServiceOrder[]>([]);
  currentRole = signal<Perfil>(Perfil.CLIENTE);
  filtroTab = signal<string>('TODAS');

  ngOnInit() {
    this.roleSwitcher.role$.subscribe(r => {
      this.currentRole.set(r);
      this.carregarOrdens();
    });
    this.carregarOrdens();
  }

  // 🔵 CORRIGIDO - Removeu os parâmetros 'u1' e 'u4'
  async carregarOrdens() {
    const role = this.currentRole();
    try {
      let result: ServiceOrder[];
      if (role === Perfil.CLIENTE) {
        result = await this.mockService.listarOrdensDoCliente();
      } else if (role === Perfil.PRESTADOR) {
        result = await this.mockService.listarOrdensDoPrestador();
      } else {
        result = [];
      }
      this.ordens.set(result);
    } catch (e) {
      console.error('Erro ao carregar ordens', e);
    }
  }

  filtrarPorStatus(status?: StatusOrdem): ServiceOrder[] {
    if (!status) return this.ordens();
    return this.ordens().filter(o => o.status === status);
  }

  onTabChange(index: number) {
    const tabs = ['TODAS', 'REQUESTED', 'ACCEPTED', 'COMPLETED', 'CANCELED'];
    this.filtroTab.set(tabs[index] || 'TODAS');
  }
}