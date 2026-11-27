// contratar-dialog.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Servico } from '../../../core/models';

@Component({
  template: `
    <h2 mat-dialog-title>Solicitar Serviço</h2>
    <mat-dialog-content>
      <p><strong>{{ data.servico.titulo }}</strong></p>
      <p>Prestador: {{ data.servico.prestadorNome }}</p>
      <p>Valor: R$ {{ data.servico.preco.toFixed(2) }}</p>

      <mat-form-field appearance="outline" class="w-100 mt-2">
        <mat-label>Descreva o que precisa</mat-label>
        <textarea matInput [(ngModel)]="descricao" rows="4"
                  placeholder="Descreva detalhes do serviço..." required></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!descricao.trim()" (click)="confirmar()">
        Solicitar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule]
})
export class ContratarDialogComponent {
  dialogRef = inject(MatDialogRef<ContratarDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as { servico: Servico };
  descricao = '';

  confirmar() {
    this.dialogRef.close({ descricao: this.descricao });
  }
}