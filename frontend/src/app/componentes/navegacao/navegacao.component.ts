import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicoAutenticacao } from '../../servicos/servico-autenticacao';
import { Usuario } from '../../modelos/modelo-usuario';

@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navegacao.component.html',
  styleUrl: './navegacao.component.css'
})
export class NavegacaoComponent {
  usuarioLogado: Usuario | null = null;
  abaAtiva: string = 'feed';
  @Output() abaSelecionada = new EventEmitter<string>();

  constructor(private servicoAutenticacao: ServicoAutenticacao) {}

  ngOnInit(): void {
    this.usuarioLogado = this.servicoAutenticacao.getUsuarioLogado();
  }

  logout(): void {
    this.servicoAutenticacao.logout();
    window.location.reload();
  }

  alternarAba(aba: string): void {
    this.abaAtiva = aba;
    this.abaSelecionada.emit(aba);
  }
}