import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicoDados } from '../../servicos/servico-dados';
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';
import { Usuario } from '../../modelos/modelo-usuario';
import { Publicacao } from '../../modelos/modelo-publicacao';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  usuarios: Usuario[] = [];
  publicacoes: Publicacao[] = [];
  estatisticas: any = {};

  constructor(
    private servicoDados: ServicoDados,
    private servicoAutenticacao: ServicoAutenticacao
  ) {}

  ngOnInit(): void {
    if (this.servicoAutenticacao.isAdmin()) {
      this.usuarios = this.servicoDados.getUsuarios();
      this.publicacoes = this.servicoDados.getPublicacoes();
      this.calcularEstatisticas();
    }
  }

  calcularEstatisticas(): void {
    this.estatisticas = {
      totalUsuarios: this.usuarios.length,
      totalPublicacoes: this.publicacoes.length,
      totalCurtidas: this.publicacoes.reduce((total, pub) => total + pub.curtidas, 0),
      totalComentarios: this.publicacoes.reduce((total, pub) => total + pub.comentarios.length, 0),
      usuariosOnline: this.usuarios.filter(u => u.isOnline).length
    };
  }

  alternarStatusUsuario(usuario: Usuario): void {
    usuario.isOnline = !usuario.isOnline;
  }

  alternarAdmin(usuario: Usuario): void {
    if (usuario.id !== 1) { // Não permitir remover admin do usuário principal
      usuario.isAdmin = !usuario.isAdmin;
    }
  }

  excluirPublicacao(publicacao: Publicacao): void {
    this.publicacoes = this.publicacoes.filter(p => p.id !== publicacao.id);
    this.calcularEstatisticas();
  }
}