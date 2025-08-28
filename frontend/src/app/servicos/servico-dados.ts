import { Injectable } from '@angular/core';
import { Publicacao, Comentario } from '../modelos/modelo-publicacao';
import { Mensagem } from '../modelos/modelo-mensagem';
import { Usuario } from '../modelos/modelo-usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicoDados {
  private publicacoes: Publicacao[] = [
    new Publicacao(1, 1, 'Administrador', 'assets/avatar-padrao.jpg', 'Bem-vindos à nossa rede social!', new Date(), 15, [
      new Comentario(1, 2, 'Usuário Teste', 'assets/avatar-padrao.jpg', 'Que legal!', new Date())
    ]),
    new Publicacao(2, 2, 'Usuário Teste', 'assets/avatar-padrao.jpg', 'Estou animado para usar esta rede!', new Date(), 8, [])
  ];

  private mensagens: Mensagem[] = [
    new Mensagem(1, 1, 'Administrador', 2, 'Olá, bem-vindo à nossa rede!', new Date(), false),
    new Mensagem(2, 2, 'Usuário Teste', 1, 'Obrigado! Estou gostando muito!', new Date(), true)
  ];

  private usuarios: Usuario[] = [
    new Usuario(1, 'Administrador', 'admin@email.com', '', 'assets/avatar-padrao.jpg', true, true),
    new Usuario(2, 'Usuário Teste', 'usuario@email.com', '', 'assets/avatar-padrao.jpg', true, false)
  ];

  constructor() {}

  getPublicacoes(): Publicacao[] {
    return this.publicacoes;
  }

  adicionarPublicacao(conteudo: string, usuario: Usuario): void {
    const novaPublicacao = new Publicacao(
      this.publicacoes.length + 1,
      usuario.id,
      usuario.nome,
      usuario.avatar,
      conteudo,
      new Date(),
      0,
      []
    );
    this.publicacoes.unshift(novaPublicacao);
  }

  curtirPublicacao(id: number): void {
    const publicacao = this.publicacoes.find(p => p.id === id);
    if (publicacao) {
      publicacao.curtidas++;
    }
  }

  adicionarComentario(idPublicacao: number, conteudo: string, usuario: Usuario): void {
    const publicacao = this.publicacoes.find(p => p.id === idPublicacao);
    if (publicacao) {
      const novoComentario = new Comentario(
        publicacao.comentarios.length + 1,
        usuario.id,
        usuario.nome,
        usuario.avatar,
        conteudo,
        new Date()
      );
      publicacao.comentarios.push(novoComentario);
    }
  }

  getMensagens(usuarioId: number): Mensagem[] {
    return this.mensagens.filter(m => 
      m.remetenteId === usuarioId || m.destinatarioId === usuarioId
    );
  }

  enviarMensagem(remetente: Usuario, destinatarioId: number, conteudo: string): void {
    const novaMensagem = new Mensagem(
      this.mensagens.length + 1,
      remetente.id,
      remetente.nome,
      destinatarioId,
      conteudo,
      new Date(),
      false
    );
    this.mensagens.push(novaMensagem);
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }
}