import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DadosMockService } from '../../core/services/dados-mock.service';

@Component({
  template: `
    <h2 mat-dialog-title>Avaliar Serviço</h2>
    <mat-dialog-content>
      <p>Deixe sua avaliação para <strong>{{ data.servicoTitulo }}</strong></p>

      <div class="stars-container">
        @for (star of [1,2,3,4,5]; track star) {
          <button mat-icon-button (click)="nota = star" [class.active]="star <= nota" class="star-btn">
            <mat-icon>{{ star <= nota ? 'star' : 'star_border' }}</mat-icon>
          </button>
        }
      </div>

      <mat-form-field appearance="outline" class="w-100 mt-2">
        <mat-label>Comentário (opcional)</mat-label>
        <textarea matInput [(ngModel)]="comentario" rows="3" maxlength="500"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="nota === 0" (click)="confirmar()">
        Avaliar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .stars-container { text-align: center; margin: 16px 0; }
    .star-btn { color: #ccc;
      &.active { color: #ffc107; }
      mat-icon { font-size: 32px; }
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule]
})
export class AvaliacaoDialogComponent {
  dialogRef = inject(MatDialogRef<AvaliacaoDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as { ordemId: string; servicoTitulo: string };
  
  nota = 0;
  comentario = '';

  confirmar() {
    this.dialogRef.close({ nota: this.nota, comentario: this.comentario });
  }
}