// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, TipoUsuario, Perfil } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private readonly REGISTERED_KEY = 'registered_users';
  currentUser = signal<Usuario | null>(null);
  isLoggedIn = signal(false);

  constructor(private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const users: Usuario[] = [
      { 
        id: 'u1', nome: 'Carlos Silva', email: 'carlos@email.com', 
        telefone: '(11) 99999-0001', fotoUrl: 'https://i.pravatar.cc/150?u=carlos',
        tipo: TipoUsuario.CLIENTE, ativo: true, criadoEm: new Date().toISOString(),
        senha: '123456'
      },
      { 
        id: 'u4', nome: 'Pedro Souza', email: 'pedro@email.com', 
        telefone: '(11) 99999-0004', fotoUrl: 'https://i.pravatar.cc/150?u=pedro',
        tipo: TipoUsuario.PRESTADOR, ativo: true, criadoEm: new Date().toISOString(),
        senha: '123456'
      },
      { 
        id: 'u8', nome: 'Administrador', email: 'admin@email.com', 
        telefone: '(11) 99999-0008', fotoUrl: 'https://i.pravatar.cc/150?u=admin',
        tipo: TipoUsuario.ADMIN, ativo: true, criadoEm: new Date().toISOString(),
        senha: '123456'
      }
    ];

    const registered: Usuario[] = JSON.parse(localStorage.getItem(this.REGISTERED_KEY) || '[]');
    const user = [...users, ...registered].find(u => u.email === email && (u as any).senha === password);
    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  async cadastrar(nome: string, email: string, password: string, tipo: Perfil): Promise<boolean> {
    let tipoUsuario: TipoUsuario;
    switch(tipo) {
      case Perfil.CLIENTE: tipoUsuario = TipoUsuario.CLIENTE; break;
      case Perfil.PRESTADOR: tipoUsuario = TipoUsuario.PRESTADOR; break;
      case Perfil.ADMIN: tipoUsuario = TipoUsuario.ADMIN; break;
      default: tipoUsuario = TipoUsuario.CLIENTE;
    }

    const novoUsuario: any = {
      id: `u${Date.now()}`,
      nome,
      email,
      telefone: '(11) 99999-0000',
      fotoUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
      tipo: tipoUsuario,
      ativo: true,
      criadoEm: new Date().toISOString(),
      senha: password
    };
    
    const registered: Usuario[] = JSON.parse(localStorage.getItem(this.REGISTERED_KEY) || '[]');
    if (registered.some(u => u.email === email)) {
      return false;
    }

    localStorage.setItem(this.REGISTERED_KEY, JSON.stringify([...registered, novoUsuario]));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(novoUsuario));
    this.currentUser.set(novoUsuario);
    this.isLoggedIn.set(true);
    return true;
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  // 🔵 MÉTODOS NOVOS - ESSENCIAIS!
  getCurrentUserId(): string {
    const user = this.currentUser();
    return user?.id || 'u1';
  }

  getCurrentUserNome(): string {
    const user = this.currentUser();
    return user?.nome || 'Usuário';
  }

  getCurrentUserTipo(): Perfil {
    const user = this.currentUser();
    if (!user) return Perfil.CLIENTE;
    return this.getPerfilFromTipoUsuario(user.tipo);
  }

  getTipoUsuarioFromPerfil(perfil: Perfil): TipoUsuario {
    switch(perfil) {
      case Perfil.CLIENTE: return TipoUsuario.CLIENTE;
      case Perfil.PRESTADOR: return TipoUsuario.PRESTADOR;
      case Perfil.ADMIN: return TipoUsuario.ADMIN;
      default: return TipoUsuario.CLIENTE;
    }
  }

  getPerfilFromTipoUsuario(tipo: TipoUsuario): Perfil {
    switch(tipo) {
      case TipoUsuario.CLIENTE: return Perfil.CLIENTE;
      case TipoUsuario.PRESTADOR: return Perfil.PRESTADOR;
      case TipoUsuario.ADMIN: return Perfil.ADMIN;
      default: return Perfil.CLIENTE;
    }
  }
}