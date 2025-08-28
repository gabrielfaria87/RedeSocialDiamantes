import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/modelo-usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicoAutenticacao {
  private usuarioLogado: Usuario | null = null;
  private readonly CHAVE_USUARIO = 'usuarioLogado';

  constructor() {
    // Verificar se há usuário salvo no localStorage
    const usuarioSalvo = localStorage.getItem(this.CHAVE_USUARIO);
    if (usuarioSalvo) {
      this.usuarioLogado = JSON.parse(usuarioSalvo);
    }
  }

  login(email: string, senha: string): boolean {
    // Simulação - na prática, isso virá do backend
    if (email === 'admin@email.com' && senha === 'admin123') {
      this.usuarioLogado = new Usuario(1, 'Administrador', email, '', '', true, true);
      localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(this.usuarioLogado));
      return true;
    } else if (email === 'usuario@email.com' && senha === 'user123') {
      this.usuarioLogado = new Usuario(2, 'Usuário Teste', email, '', '', true, false);
      localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(this.usuarioLogado));
      return true;
    }
    return false;
  }

  logout(): void {
    this.usuarioLogado = null;
    localStorage.removeItem(this.CHAVE_USUARIO);
  }

  getUsuarioLogado(): Usuario | null {
    return this.usuarioLogado;
  }

  estaLogado(): boolean {
    return this.usuarioLogado !== null;
  }

  isAdmin(): boolean {
    return this.usuarioLogado?.isAdmin || false;
  }
}