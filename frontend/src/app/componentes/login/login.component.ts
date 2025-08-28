import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private servicoAutenticacao: ServicoAutenticacao) {}

  login(): void {
    this.erro = '';
    if (!this.servicoAutenticacao.login(this.email, this.senha)) {
      this.erro = 'Email ou senha incorretos';
    }
    // A navegação agora é feita pelo ServicoAutenticacao
  }
}