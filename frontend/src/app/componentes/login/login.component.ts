import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(
    private servicoAutenticacao: ServicoAutenticacao,
    private router: Router
  ) {}

  login(): void {
    this.erro = '';
    if (this.servicoAutenticacao.login(this.email, this.senha)) {
      this.router.navigate(['/feed']);
    } else {
      this.erro = 'Email ou senha incorretos';
    }
  }
}