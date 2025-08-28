import { Injectable } from '@angular/core';
import { Publicacao, Comentario } from '../modelos/modelo-publicacao';
import { Mensagem } from '../modelos/modelo-mensagem';
import { Usuario } from '../modelos/modelo-usuario';
import { TopicoForum, MensagemForum, CategoriaForum } from '../modelos/modelo-forum';

@Injectable({
  providedIn: 'root'
})
export class ServicoDados {
  // Usuários
  private usuarios: Usuario[] = [
    new Usuario(1, 'Administrador', 'admin@email.com', '', this.getAvatarFromNome('Administrador'), true, true),
    new Usuario(2, 'Usuário Teste', 'usuario@email.com', '', this.getAvatarFromNome('Usuário Teste'), true, false),
    new Usuario(3, 'Maria Silva', 'maria@email.com', '', this.getAvatarFromNome('Maria Silva'), true, false),
    new Usuario(4, 'João Santos', 'joao@email.com', '', this.getAvatarFromNome('João Santos'), false, false),
    new Usuario(5, 'Ana Costa', 'ana@email.com', '', this.getAvatarFromNome('Ana Costa'), true, false)
  ];

  // Publicações
  private publicacoes: Publicacao[] = [
    new Publicacao(1, 1, 'Administrador', this.getAvatarFromNome('Administrador'), 'Bem-vindos à nossa rede social!', new Date(), 15, [
      new Comentario(1, 2, 'Usuário Teste', this.getAvatarFromNome('Usuário Teste'), 'Que legal!', new Date())
    ]),
    new Publicacao(2, 2, 'Usuário Teste', this.getAvatarFromNome('Usuário Teste'), 'Estou animado para usar esta rede!', new Date(), 8, [])
  ];

  // Mensagens de chat
  private mensagens: Mensagem[] = [
    new Mensagem(1, 1, 'Administrador', 2, 'Olá, bem-vindo à nossa rede!', new Date(), false),
    new Mensagem(2, 2, 'Usuário Teste', 1, 'Obrigado! Estou gostando muito!', new Date(), true)
  ];

  // Fórum
  private topicosForum: TopicoForum[] = [
    new TopicoForum(1, 'Bem-vindos ao Fórum!', 'Espaço para se apresentarem e darem as boas-vindas', 1, 'Administrador', this.getAvatarFromNome('Administrador'), new Date(), [
      new MensagemForum(1, 1, 1, 'Administrador', this.getAvatarFromNome('Administrador'), 'Sejam todos bem-vindos ao nosso fórum! Sintam-se à vontade para criar novos tópicos e participar das discussões.', new Date(), 8)
    ], true, 'Geral'),
    new TopicoForum(2, 'Dúvidas sobre Angular', 'Tire suas dúvidas sobre desenvolvimento com Angular', 2, 'Usuário Teste', this.getAvatarFromNome('Usuário Teste'), new Date(), [
      new MensagemForum(2, 2, 2, 'Usuário Teste', this.getAvatarFromNome('Usuário Teste'), 'Alguém pode me ajudar com rotas no Angular?', new Date(), 3)
    ], false, 'Tecnologia')
  ];

  private categoriasForum: CategoriaForum[] = [
    new CategoriaForum(1, 'Geral', 'Discussões gerais', '💬'),
    new CategoriaForum(2, 'Tecnologia', 'Tópicos sobre tecnologia', '💻'),
    new CategoriaForum(3, 'Eventos', 'Eventos e atividades', '🎉')
  ];

  constructor() {}

  // Método para gerar avatar padrão a partir do nome
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

  // ========== MÉTODOS DE USUÁRIOS ==========
  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  getUsuariosOnline(): Usuario[] {
    return this.usuarios.filter(u => u.isOnline);
  }

  toggleStatusUsuario(usuarioId: number): void {
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    if (usuario) {
      usuario.isOnline = !usuario.isOnline;
    }
  }

  getUsuarioPorId(id: number): Usuario | undefined {
    return this.usuarios.find(u => u.id === id);
  }

  // ========== MÉTODOS DE PUBLICAÇÕES ==========
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

  deletarPublicacao(id: number, usuarioId: number): boolean {
    const index = this.publicacoes.findIndex(p => p.id === id && p.usuarioId === usuarioId);
    if (index !== -1) {
      this.publicacoes.splice(index, 1);
      return true;
    }
    return false;
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

  // ========== MÉTODOS DE CHAT ==========
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

  // ========== MÉTODOS DE FÓRUM ==========
  getTopicosForum(): TopicoForum[] {
    return this.topicosForum;
  }

  getTopicoPorId(id: number): TopicoForum | undefined {
    return this.topicosForum.find(t => t.id === id);
  }

  criarTopico(titulo: string, descricao: string, categoria: string, usuario: Usuario): void {
    const novoTopic = new TopicoForum(
      this.topicosForum.length + 1,
      titulo,
      descricao,
      usuario.id,
      usuario.nome,
      usuario.avatar,
      new Date(),
      [],
      false,
      categoria
    );
    this.topicosForum.unshift(novoTopic);
  }

  adicionarMensagemForum(topicoId: number, conteudo: string, usuario: Usuario): void {
    const topico = this.topicosForum.find(t => t.id === topicoId);
    if (topico) {
      const novaMensagem = new MensagemForum(
        topico.mensagens.length + 1,
        topicoId,
        usuario.id,
        usuario.nome,
        usuario.avatar,
        conteudo,
        new Date(),
        0
      );
      topico.mensagens.push(novaMensagem);
    }
  }

  curtirMensagemForum(topicoId: number, mensagemId: number): void {
    const topico = this.topicosForum.find(t => t.id === topicoId);
    if (topico) {
      const mensagem = topico.mensagens.find(m => m.id === mensagemId);
      if (mensagem) {
        mensagem.curtidas++;
      }
    }
  }

  getCategoriasForum(): CategoriaForum[] {
    return this.categoriasForum;
  }

  deletarTopico(id: number, usuarioId: number): boolean {
    const index = this.topicosForum.findIndex(t => t.id === id && (t.criadorId === usuarioId || usuarioId === 1));
    if (index !== -1) {
      this.topicosForum.splice(index, 1);
      return true;
    }
    return false;
  }

  fixarTopico(id: number): void {
    const topico = this.topicosForum.find(t => t.id === id);
    if (topico) {
      topico.isFixo = !topico.isFixo;
    }
  }
}