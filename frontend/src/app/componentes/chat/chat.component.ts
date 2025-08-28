import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicoDados } from '../../servicos/servico-dados';
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';
import { Mensagem } from '../../modelos/modelo-mensagem';
import { Usuario } from '../../modelos/modelo-usuario';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent {
  usuarios: Usuario[] = [];
  usuarioSelecionado: Usuario | null = null;
  mensagens: Mensagem[] = [];
  novaMensagem: string = '';
  usuarioLogado: Usuario | null = null;

  constructor(
    private servicoDados: ServicoDados,
    private servicoAutenticacao: ServicoAutenticacao
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.servicoAutenticacao.getUsuarioLogado();
    if (this.usuarioLogado) {
      this.usuarios = this.servicoDados.getUsuarios().filter((u: Usuario) => u.id !== this.usuarioLogado?.id);
      
      if (this.usuarios.length > 0) {
        this.selecionarUsuario(this.usuarios[0]);
      }
    }
  }

  selecionarUsuario(usuario: Usuario): void {
    this.usuarioSelecionado = usuario;
    if (this.usuarioLogado) {
      this.mensagens = this.servicoDados.getMensagens(this.usuarioLogado.id)
        .filter((m: Mensagem) => 
          (m.remetenteId === usuario.id && m.destinatarioId === this.usuarioLogado!.id) ||
          (m.remetenteId === this.usuarioLogado!.id && m.destinatarioId === usuario.id)
        )
        .sort((a: Mensagem, b: Mensagem) => new Date(a.data).getTime() - new Date(b.data).getTime());
    }
  }

  enviarMensagem(): void {
    if (this.novaMensagem.trim() && this.usuarioSelecionado && this.usuarioLogado) {
      this.servicoDados.enviarMensagem(this.usuarioLogado, this.usuarioSelecionado.id, this.novaMensagem);
      this.novaMensagem = '';
      this.selecionarUsuario(this.usuarioSelecionado); // Recarregar mensagens
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}