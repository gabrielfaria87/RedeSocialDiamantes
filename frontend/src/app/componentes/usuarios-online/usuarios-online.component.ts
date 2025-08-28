import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../modelos/modelo-usuario';
import { ServicoDados } from '../../servicos/servico-dados';

@Component({
  selector: 'app-usuarios-online',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-online.component.html',
  styleUrl: './usuarios-online.component.css'
})
export class UsuariosOnlineComponent {
  @Input() usuarioLogado: Usuario | null = null;
  usuariosOnline: Usuario[] = [];

  constructor(private servicoDados: ServicoDados) {}

  ngOnInit(): void {
    this.carregarUsuariosOnline();
  }

  carregarUsuariosOnline(): void {
    this.usuariosOnline = this.servicoDados.getUsuariosOnline();
  }

  toggleStatusUsuario(usuario: Usuario): void {
    if (this.usuarioLogado?.isAdmin) {
      this.servicoDados.toggleStatusUsuario(usuario.id);
      this.carregarUsuariosOnline();
    }
  }
}