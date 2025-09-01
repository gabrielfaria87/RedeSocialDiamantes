import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicoDados } from '../../servicos/servico-dados';
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';
import { TopicoForum, MensagemForum, CategoriaForum } from '../../modelos/modelo-forum';
import { Usuario } from '../../modelos/modelo-usuario';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent {
  topicos: TopicoForum[] = [];
  categorias: CategoriaForum[] = [];
  topicoSelecionado: TopicoForum | null = null;
  usuarioLogado: Usuario | null = null;
  
  // Variáveis para criar novo tópico
  criandoTopico: boolean = false;
  novoTopicTitulo: string = '';
  novoTopicDescricao: string = '';
  novoTopicCategoria: string = 'Geral';
  
  // Variáveis para mensagens
  novaMensagem: string = '';
  filtrandoCategoria: string = 'Todas';

  constructor(
    private servicoDados: ServicoDados,
    private servicoAutenticacao: ServicoAutenticacao
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.servicoAutenticacao.getUsuarioLogado();
    this.carregarTopicos();
    this.categorias = this.servicoDados.getCategoriasForum();
  }

  carregarTopicos(): void {
    this.topicos = this.servicoDados.getTopicosForum();
    if (this.filtrandoCategoria !== 'Todas') {
      this.topicos = this.topicos.filter(t => t.categoria === this.filtrandoCategoria);
    }
  }

  selecionarTopico(topico: TopicoForum): void {
    this.topicoSelecionado = topico;
  }

  voltarParaLista(): void {
    this.topicoSelecionado = null;
    this.novaMensagem = '';
  }

  criarNovoTopico(): void {
    if (this.novoTopicTitulo.trim() && this.novoTopicDescricao.trim() && this.usuarioLogado) {
      this.servicoDados.criarTopico(
        this.novoTopicTitulo,
        this.novoTopicDescricao,
        this.novoTopicCategoria,
        this.usuarioLogado
      );
      
      this.novoTopicTitulo = '';
      this.novoTopicDescricao = '';
      this.novoTopicCategoria = 'Geral';
      this.criandoTopico = false;
      this.carregarTopicos();
    }
  }

  enviarMensagem(): void {
    if (this.novaMensagem.trim() && this.topicoSelecionado && this.usuarioLogado) {
      this.servicoDados.adicionarMensagemForum(
        this.topicoSelecionado.id,
        this.novaMensagem,
        this.usuarioLogado
      );
      this.novaMensagem = '';
      
      // Atualizar o tópico selecionado
      const topicoAtualizado = this.servicoDados.getTopicoPorId(this.topicoSelecionado.id);
      if (topicoAtualizado) {
        this.topicoSelecionado = topicoAtualizado;
      }
    }
  }

  curtirMensagem(mensagem: MensagemForum): void {
    if (this.topicoSelecionado) {
      this.servicoDados.curtirMensagemForum(this.topicoSelecionado.id, mensagem.id);
      
      // Atualizar o tópico selecionado
      const topicoAtualizado = this.servicoDados.getTopicoPorId(this.topicoSelecionado.id);
      if (topicoAtualizado) {
        this.topicoSelecionado = topicoAtualizado;
      }
    }
  }

  deletarTopico(topico: TopicoForum): void {
  if (this.usuarioLogado && (topico.criadorId === this.usuarioLogado.id || this.usuarioLogado.isAdmin)) {
      const confirmacao = confirm('Tem certeza que deseja excluir este tópico?');
      if (confirmacao) {
  this.servicoDados.deletarTopico(topico.id, this.usuarioLogado.id);
        this.carregarTopicos();
        if (this.topicoSelecionado?.id === topico.id) {
          this.voltarParaLista();
        }
      }
    }
  }

  fixarTopico(topico: TopicoForum): void {
    if (this.usuarioLogado?.isAdmin) {
      this.servicoDados.fixarTopico(topico.id);
      this.carregarTopicos();
    }
  }

  filtrarPorCategoria(categoria: string): void {
    this.filtrandoCategoria = categoria;
    this.carregarTopicos();
  }

  podeDeletarTopico(topico: TopicoForum): boolean {
    return this.usuarioLogado !== null && 
           (topico.criadorId === this.usuarioLogado.id || this.usuarioLogado.isAdmin);
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  getTopicosFixos(): TopicoForum[] {
    return this.topicos.filter(t => t.isFixo);
  }

  getTopicosNormais(): TopicoForum[] {
    return this.topicos.filter(t => !t.isFixo);
  }
}