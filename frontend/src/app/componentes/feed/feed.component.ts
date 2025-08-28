import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicoDados } from '../../servicos/servico-dados';
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';
import { Publicacao, Comentario } from '../../modelos/modelo-publicacao';
import { Usuario } from '../../modelos/modelo-usuario';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  publicacoes: Publicacao[] = [];
  novaPublicacao: string = '';
  comentarioAtivo: number | null = null;
  novoComentario: string = '';
  usuarioLogado: Usuario | null = null;

  constructor(
    private servicoDados: ServicoDados,
    private servicoAutenticacao: ServicoAutenticacao
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.servicoAutenticacao.getUsuarioLogado();
    this.carregarPublicacoes();
  }

  carregarPublicacoes(): void {
    this.publicacoes = this.servicoDados.getPublicacoes();
  }

  publicar(): void {
    if (this.novaPublicacao.trim() && this.usuarioLogado) {
      this.servicoDados.adicionarPublicacao(this.novaPublicacao, this.usuarioLogado);
      this.novaPublicacao = '';
      this.carregarPublicacoes();
    }
  }

  deletarPublicacao(publicacao: Publicacao): void {
    if (this.usuarioLogado && 
        (publicacao.usuarioId === this.usuarioLogado.id || this.usuarioLogado.isAdmin)) {
      const confirmacao = confirm('Tem certeza que deseja excluir esta publicação?');
      if (confirmacao) {
        this.servicoDados.deletarPublicacao(publicacao.id, publicacao.usuarioId);
        this.carregarPublicacoes();
      }
    }
  }

  curtir(publicacao: Publicacao): void {
    this.servicoDados.curtirPublicacao(publicacao.id);
    this.carregarPublicacoes();
  }

  toggleComentarios(publicacaoId: number): void {
    this.comentarioAtivo = this.comentarioAtivo === publicacaoId ? null : publicacaoId;
    this.novoComentario = '';
  }

  comentar(publicacao: Publicacao): void {
    if (this.novoComentario.trim() && this.usuarioLogado) {
      this.servicoDados.adicionarComentario(publicacao.id, this.novoComentario, this.usuarioLogado);
      this.novoComentario = '';
      this.carregarPublicacoes();
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  podeDeletar(publicacao: Publicacao): boolean {
    return this.usuarioLogado !== null && 
           (publicacao.usuarioId === this.usuarioLogado.id || this.usuarioLogado.isAdmin);
  }
}