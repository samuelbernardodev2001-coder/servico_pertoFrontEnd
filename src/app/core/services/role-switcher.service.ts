import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Perfil } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleSwitcherService {
  private initialRole = this.loadStoredRole();
  private roleSubject = new BehaviorSubject<Perfil>(this.initialRole);
  role$: Observable<Perfil> = this.roleSubject.asObservable();
  currentRole = signal<Perfil>(this.initialRole);

  private loadStoredRole(): Perfil {
    const stored = localStorage.getItem('app_current_role');
    if (stored && Object.values(Perfil).includes(stored as Perfil)) {
      return stored as Perfil;
    }
    return Perfil.CLIENTE;
  }

  setRole(role: Perfil): void {
    this.roleSubject.next(role);
    this.currentRole.set(role);
    localStorage.setItem('app_current_role', role);
  }

  getRole(): Perfil {
    return this.roleSubject.value;
  }

  isCliente(): boolean {
    return this.getRole() === Perfil.CLIENTE;
  }

  isPrestador(): boolean {
    return this.getRole() === Perfil.PRESTADOR;
  }

  isAdmin(): boolean {
    return this.getRole() === Perfil.ADMIN;
  }
}