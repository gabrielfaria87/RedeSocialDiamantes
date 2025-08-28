import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Adicionar esta linha
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Adicionar CommonModule aqui
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
    if (this.servicoAutenticacao.login(this.email, this.senha)) {
      // Recarrega a página para atualizar a aplicação
      window.location.reload();
    } else {
      this.erro = 'Email ou senha incorretos';
    }
  }
}