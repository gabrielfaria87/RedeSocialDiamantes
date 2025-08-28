import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicoAutenticacao } from './servicos/servico-autenticacao';
import { NavegacaoComponent } from './componentes/navegacao/navegacao.component';
import { LoginComponent } from './componentes/login/login.component';
import { FeedComponent } from './componentes/feed/feed.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { AdminComponent } from './componentes/admin/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavegacaoComponent,
    LoginComponent,
    FeedComponent,
    ChatComponent,
    AdminComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Rede Social do Curso';
  abaAtiva: string = 'feed';

  constructor(private servicoAutenticacao: ServicoAutenticacao) {}

  estaLogado(): boolean {
    return this.servicoAutenticacao.estaLogado();
  }

  isAdmin(): boolean {
    return this.servicoAutenticacao.isAdmin();
  }

  alternarAba(aba: string): void {
    this.abaAtiva = aba;
  }
}