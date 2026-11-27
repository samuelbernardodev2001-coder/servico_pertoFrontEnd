import { Pipe, PipeTransform } from '@angular/core';
import { StatusOrdem } from '../../core/models';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: StatusOrdem): string {
    const colors: Record<string, string> = {
      'REQUESTED': '#ff9800',   // Laranja
      'ACCEPTED': '#2196f3',    // Azul
      'COMPLETED': '#4caf50',   // Verde
      'CANCELED': '#f44336'     // Vermelho
    };
    return colors[status] || '#757575';
  }
}