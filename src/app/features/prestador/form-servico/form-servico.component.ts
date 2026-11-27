import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { DadosMockService } from '../../../core/services/dados-mock.service';
import { Servico, Categoria } from '../../../core/models';

@Component({
  selector: 'app-form-servico',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="form-servico-page fade-in">
      <button mat-icon-button class="back-btn" (click)="voltar()">
        <mat-icon>arrow_back</mat-icon>
      </button>

      <h1>{{ editando() ? 'Editar Serviço' : 'Novo Serviço' }}</h1>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="salvar()" class="servico-form">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Título do Serviço</mat-label>
                <input matInput formControlName="titulo" maxlength="100" placeholder="Ex: Instalação Elétrica Residencial">
                @if (form.get('titulo')?.hasError('required') && form.get('titulo')?.touched) {
                  <mat-error>Título é obrigatório</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Categoria</mat-label>
                <mat-select formControlName="categoriaId">
                  @for (cat of categorias(); track cat.id) {
                    <mat-option [value]="cat.id">{{ cat.nome }}</mat-option>
                  }
                </mat-select>
                @if (form.get('categoriaId')?.hasError('required') && form.get('categoriaId')?.touched) {
                  <mat-error>Selecione uma categoria</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Preço (R$)</mat-label>
                <input matInput type="number" formControlName="preco" min="0" step="0.01">
                @if (form.get('preco')?.hasError('required') && form.get('preco')?.touched) {
                  <mat-error>Preço é obrigatório</mat-error>
                }
                @if (form.get('preco')?.hasError('min')) {
                  <mat-error>Preço deve ser maior que zero</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descrição</mat-label>
                <textarea matInput formControlName="descricao" rows="5" maxlength="1000" placeholder="Descreva detalhadamente seu serviço..."></textarea>
                @if (form.get('descricao')?.hasError('required') && form.get('descricao')?.touched) {
                  <mat-error>Descrição é obrigatória</mat-error>
                }
                @if (form.get('descricao')?.hasError('maxlength')) {
                  <mat-error>Máximo de 1000 caracteres</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="voltar()">Cancelar</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
                {{ saving() ? 'Salvando...' : (editando() ? 'Atualizar Serviço' : 'Criar Serviço') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-servico-page { max-width: 700px; margin: 0 auto; }
    .back-btn { margin-bottom: 16px; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 24px; }

    .servico-form { display: flex; flex-direction: column; gap: 16px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
  `]
})
export class FormServicoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(DadosMockService);
  private snackBar = inject(MatSnackBar);

  editando = signal(false);
  saving = signal(false);
  categorias = signal<Categoria[]>([]);

  form: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    categoriaId: ['', Validators.required],
    preco: ['', [Validators.required, Validators.min(0.01)]],
    descricao: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  async ngOnInit() {
    try {
      const cats = await this.mockService.listarCategoriasTodas();
      this.categorias.set(cats.filter(c => c.ativa));
    } catch (e) {}

    const servicoId = this.route.snapshot.paramMap.get('id');
    if (servicoId) {
      this.editando.set(true);
      try {
        const s = await this.mockService.getServicoById(servicoId);
        this.form.patchValue({
          titulo: s.titulo,
          categoriaId: s.categoriaId,
          preco: s.preco,
          descricao: s.descricao
        });
      } catch (e) {
        this.snackBar.open('Erro ao carregar serviço', 'Fechar');
        this.router.navigate(['/prestador/servicos']);
      }
    }
  }

  async salvar() {
    if (this.form.invalid) return;
    this.saving.set(true);

    try {
      const dados = this.form.value;
      const servicoId = this.route.snapshot.paramMap.get('id');

      if (servicoId) {
        // EDIÇÃO - atualizar serviço existente
        await this.mockService.atualizarServico(servicoId, {
          ...dados,
          categoriaNome: this.categorias().find(c => c.id === dados.categoriaId)?.nome || ''
        });
        this.snackBar.open('Serviço atualizado!', 'OK', { duration: 2000 });
      } else {
        // 🔵 CORRIGIDO - NÃO enviar prestadorId, prestadorNome, prestadorFotoUrl
        // O DadosMockService.criarServico() preenche automaticamente com o usuário logado
        await this.mockService.criarServico({
          categoriaId: dados.categoriaId,
          categoriaNome: this.categorias().find(c => c.id === dados.categoriaId)?.nome || '',
          titulo: dados.titulo,
          descricao: dados.descricao,
          preco: Number(dados.preco),
          imagensUrls: [],
          ativo: true,
          mediaAvaliacao: 0,
          totalAvaliacoes: 0
        });
        this.snackBar.open('Serviço criado com sucesso!', 'OK', { duration: 2000 });
      }
      this.router.navigate(['/prestador/servicos']);
    } catch (e: any) {
      this.snackBar.open(e?.message || 'Erro ao salvar', 'Fechar');
    } finally {
      this.saving.set(false);
    }
  }

  voltar() {
    this.router.navigate(['/prestador/servicos']);
  }
}