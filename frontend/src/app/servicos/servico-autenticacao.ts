import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Adicione esta importação
import { Usuario } from '../modelos/modelo-usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicoAutenticacao {
  private usuarioLogado: Usuario | null = null;
  private readonly CHAVE_USUARIO = 'usuarioLogado';

  constructor(private router: Router) { // Adicione Router no constructor
    this.carregarUsuarioSalvo();
  }

  private carregarUsuarioSalvo(): void {
    const usuarioSalvo = localStorage.getItem(this.CHAVE_USUARIO);
    if (usuarioSalvo) {
      this.usuarioLogado = JSON.parse(usuarioSalvo);
    }
  }

  login(email: string, senha: string): boolean {
    if (email === 'admin@email.com' && senha === 'admin123') {
      this.usuarioLogado = new Usuario(1, 'Administrador', email, '', this.getAvatarFromNome('Administrador'), true, true);
      localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(this.usuarioLogado));
      this.router.navigate(['/feed']); // Navega após login
      return true;
    } else if (email === 'usuario@email.com' && senha === 'user123') {
      this.usuarioLogado = new Usuario(2, 'Usuário Teste', email, '', this.getAvatarFromNome('Usuário Teste'), true, false);
      localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(this.usuarioLogado));
      this.router.navigate(['/feed']); // Navega após login
      return true;
    }
    return false;
  }

  logout(): void {
    this.usuarioLogado = null;
    localStorage.removeItem(this.CHAVE_USUARIO);
    this.router.navigate(['/login']); // Navega para login após logout
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

  private getAvatarFromNome(nome: string): string {
    const iniciais = nome.split(' ').map(n => n.charAt(0)).join('').substring(0, 2);
    const cores = ['007bff', '28a745', 'dc3545', 'ffc107', '17a2b8', '6f42c1'];
    const cor = cores[nome.length % cores.length];
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#${cor}" />
        <text x="20" y="26" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${iniciais}</text>
      </svg>
    `)}`;
  }
}