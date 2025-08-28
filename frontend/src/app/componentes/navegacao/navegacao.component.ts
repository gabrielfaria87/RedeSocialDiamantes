import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Adicione RouterModule
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';
import { Usuario } from '../../modelos/modelo-usuario';

@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navegacao.component.html',
  styleUrl: './navegacao.component.css'
})
export class NavegacaoComponent {
  usuarioLogado: Usuario | null = null;

  constructor(
    private servicoAutenticacao: ServicoAutenticacao,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.servicoAutenticacao.getUsuarioLogado();
  }

  logout(): void {
    this.servicoAutenticacao.logout();
    this.router.navigate(['/login']);
  }

  isRotaAtiva(rota: string): boolean {
    return this.router.url === `/${rota}`;
  }
}