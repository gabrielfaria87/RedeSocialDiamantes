import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';
import { ServicoDados } from '../../servicos/servico-dados';
import { Usuario } from '../../modelos/modelo-usuario';
import { Publicacao } from '../../modelos/modelo-publicacao';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'] // ⚠️ aqui era "styleUrl", o correto é "styleUrls"
})
export class PerfilComponent {
  usuario: Usuario | null = null;
  publicacoesUsuario: Publicacao[] = [];
  editando: boolean = false;
  novoNome: string = '';
  novoAvatar: string = '';

  constructor(
    private servicoAutenticacao: ServicoAutenticacao,
    private servicoDados: ServicoDados
  ) {}

  ngOnInit(): void {
    this.usuario = this.servicoAutenticacao.getUsuarioLogado();
    if (this.usuario) {
      this.carregarPublicacoesUsuario();
      this.novoNome = this.usuario.nome;
      this.novoAvatar = this.usuario.avatar;
    }
  }

  carregarPublicacoesUsuario(): void {
    if (this.usuario) {
      this.publicacoesUsuario = this.servicoDados.getPublicacoes()
        .filter((p: Publicacao) => p.usuarioId === this.usuario!.id);
    }
  }

  calcularTotalCurtidas(): number {
    return this.publicacoesUsuario.reduce((total: number, pub: Publicacao) => total + pub.curtidas, 0);
  }

  calcularTotalComentarios(): number {
    return this.publicacoesUsuario.reduce((total: number, pub: Publicacao) => total + pub.comentarios.length, 0);
  }

  salvarPerfil(): void {
    if (this.usuario) {
      this.usuario.nome = this.novoNome;
      this.usuario.avatar = this.novoAvatar;
      
      // Atualizar também nas publicações
      const publicacoes = this.servicoDados.getPublicacoes();
      publicacoes.forEach((p: Publicacao) => {
        if (p.usuarioId === this.usuario!.id) {
          p.usuarioNome = this.novoNome;
          p.usuarioAvatar = this.novoAvatar;
        }
      });
      
      this.editando = false;
      alert('Perfil atualizado com sucesso!');
    }
  }

  // 🔹 Métodos que estavam faltando
  toggleEdicao(): void {
    this.editando = !this.editando;
  }

  cancelarEdicao(): void {
    this.editando = false;
    if (this.usuario) {
      this.novoNome = this.usuario.nome;
      this.novoAvatar = this.usuario.avatar;
    }
  }

  formatarData(data: string | Date): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
