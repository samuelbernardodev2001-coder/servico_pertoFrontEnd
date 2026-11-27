import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DadosMockService } from '../../core/services/dados-mock.service.js';
import { RoleSwitcherService } from '../../core/services/role-switcher.service.js';
import { AuthService } from '../../core/services/auth.service.js';
import { Mensagem, ServiceOrder } from '../../core/models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDividerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="chat-page fade-in">
      <div class="chat-header">
        <button mat-icon-button (click)="voltar()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="chat-header-info">
          <h2>{{ ordem()?.servicoTitulo }}</h2>
          <span class="chat-with">
            {{ currentRole() === 'CLIENTE' ? ordem()?.prestadorNome : ordem()?.clienteNome }}
          </span>
        </div>
      </div>

      <div class="chat-messages" #messagesContainer>
        @if (loading()) {
          <div class="loading-msg">Carregando mensagens...</div>
        }

        @for (msg of mensagens(); track msg.id) {
          <div class="message" 
               [class.my-message]="msg.remetenteId === currentUserId()"
               [class.other-message]="msg.remetenteId !== currentUserId()">
            <div class="message-bubble">
              <p class="message-text">{{ msg.conteudo }}</p>
              <div class="message-meta">
                <span class="message-time">{{ msg.criadoEm | date:'HH:mm' }}</span>
                @if (msg.editada) {
                  <span class="edited-badge">
                    <mat-icon matTooltip="Mensagem editada">edit</mat-icon>
                    Editada
                  </span>
                }
              </div>
            </div>
            <div class="message-actions">
              @if (msg.remetenteId === currentUserId()) {
                <button mat-icon-button class="edit-btn" (click)="editarMensagem(msg)">
                  <mat-icon>edit</mat-icon>
                </button>
              }
            </div>
          </div>
        } @empty {
          @if (!loading()) {
            <div class="empty-chat">
              <mat-icon>chat</mat-icon>
              <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
            </div>
          }
        }
      </div>

      <!-- Input de edição -->
      @if (editandoMensagem(); as editMsg) {
        <div class="edit-bar">
          <span class="edit-label">Editando mensagem</span>
          <button mat-icon-button (click)="cancelarEdicao()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }

      <div class="chat-input">
        <mat-form-field appearance="outline" class="input-field">
          <input matInput [(ngModel)]="novaMensagem" 
                 [placeholder]="editandoMensagem() ? 'Edite sua mensagem...' : 'Digite sua mensagem...'"
                 (keydown.enter)="enviar()" maxlength="500">
        </mat-form-field>
        <button mat-icon-button color="primary" [disabled]="!novaMensagem.trim()" (click)="enviar()">
          <mat-icon>{{ editandoMensagem() ? 'check' : 'send' }}</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      max-width: 800px; margin: 0 auto;
      display: flex; flex-direction: column;
      height: calc(100vh - var(--header-height) - 120px);
    }

    .chat-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 0; border-bottom: 1px solid var(--border);
      margin-bottom: 16px;

      h2 { font-size: 18px; font-weight: 600; margin: 0; }
      .chat-with { font-size: 13px; color: var(--text-secondary); }
    }

    .chat-messages {
      flex: 1; overflow-y: auto;
      padding: 16px 0; display: flex; flex-direction: column; gap: 12px;
    }

    .message {
      display: flex; gap: 8px; align-items: flex-end;
      max-width: 80%;

      &.my-message {
        align-self: flex-end; flex-direction: row-reverse;
        
        .message-bubble {
          background: var(--primary); color: white;
          border-radius: 16px 16px 4px 16px;
        }
        .message-meta { color: rgba(255,255,255,0.7); }
        .edited-badge mat-icon { color: rgba(255,255,255,0.7); }
      }

      &.other-message {
        align-self: flex-start;
        .message-bubble { background: #f0f0f0; border-radius: 16px 16px 16px 4px; }
      }
    }

    .message-bubble {
      padding: 10px 14px; max-width: 100%;
      
      .message-text { margin: 0; font-size: 14px; line-height: 1.4; word-wrap: break-word; }
      .message-meta {
        display: flex; align-items: center; gap: 8px;
        margin-top: 4px; font-size: 11px;
      }
      .edited-badge {
        display: flex; align-items: center; gap: 2px;
        font-size: 10px; font-style: italic;
        mat-icon { font-size: 12px; width: 12px; height: 12px; }
      }
    }

    .message-actions {
      .edit-btn {
        width: 28px; height: 28px; line-height: 28px;
        mat-icon { font-size: 16px; }
      }
    }

    .edit-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 16px; background: #fff3e0; border-radius: 8px 8px 0 0;
      .edit-label { font-size: 13px; color: #e65100; font-weight: 500; }
    }

    .chat-input {
      display: flex; align-items: center; gap: 8px;
      padding: 16px 0; border-top: 1px solid var(--border);

      .input-field {
        flex: 1;
        ::ng-deep .mat-mdc-text-field-wrapper { height: 48px; }
      }
    }

    .loading-msg, .empty-chat {
      text-align: center; padding: 40px 0; color: var(--text-secondary);
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ddd; margin-bottom: 12px; }
    }
  `]
})
export class ChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(DadosMockService);
  private roleSwitcher = inject(RoleSwitcherService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  currentRole = this.roleSwitcher.currentRole;

  ordem = signal<ServiceOrder | null>(null);
  mensagens = signal<Mensagem[]>([]);
  loading = signal(true);
  novaMensagem = '';
  editandoMensagem = signal<Mensagem | null>(null);

  currentUserId(): string {
    // Primeiro tenta pegar o usuário logado
    const user = this.authService.currentUser();
    if (user) {
      return user.id;
    }
    // Fallback baseado no role
    const role = this.currentRole();
    if (role === 'PRESTADOR') return 'u4';
    if (role === 'ADMIN') return 'u8';
    return 'u1';
  }

  async ngOnInit() {
    const ordemId = this.route.snapshot.paramMap.get('id');
    
    if (!ordemId) {
      this.snackBar.open('Ordem não encontrada', 'Fechar');
      this.router.navigate(['/ordens']);
      return;
    }

    try {
      const o = await this.mockService.getOrdemById(ordemId);
      this.ordem.set(o);
      
      const result = await this.mockService.listarMensagens(ordemId, 0, 100);
      this.mensagens.set(result.content);

      setTimeout(() => this.scrollToBottom(), 100);
    } catch (e) {
      this.snackBar.open('Erro ao carregar chat', 'Fechar');
      this.router.navigate(['/ordens']);
    } finally {
      this.loading.set(false);
    }
  }

  async enviar() {
    const texto = this.novaMensagem.trim();
    if (!texto) return;

    const editando = this.editandoMensagem();
    const ordemId = this.route.snapshot.paramMap.get('id');
    
    if (!ordemId) return;

    try {
      if (editando) {
        await this.mockService.editarMensagem(editando.id, texto);
        this.snackBar.open('Mensagem editada', 'OK', { duration: 2000 });
      } else {
        await this.mockService.enviarMensagem(ordemId, texto);
      }

      this.novaMensagem = '';
      this.editandoMensagem.set(null);

      const result = await this.mockService.listarMensagens(ordemId, 0, 100);
      this.mensagens.set(result.content);
      setTimeout(() => this.scrollToBottom(), 100);
    } catch (e) {
      this.snackBar.open('Erro ao enviar mensagem', 'Fechar');
    }
  }

  editarMensagem(msg: Mensagem) {
    this.editandoMensagem.set(msg);
    this.novaMensagem = msg.conteudo;
  }

  cancelarEdicao() {
    this.editandoMensagem.set(null);
    this.novaMensagem = '';
  }

  voltar() {
    const ordemId = this.route.snapshot.paramMap.get('id');
    if (ordemId) {
      this.router.navigate(['/ordem', ordemId]);
    } else {
      this.router.navigate(['/ordens']);
    }
  }

  private scrollToBottom() {
    const container = document.querySelector('.chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }
}