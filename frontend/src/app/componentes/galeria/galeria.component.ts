import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css',
})
export class GaleriaComponent {
  fotos = [
    { url: './fotos/1.jpg', descricao: 'Foto 1 da galeria' },
    { url: './fotos/2.jpg', descricao: 'Foto 2 da galeria' },
    { url: './fotos/3.jpg', descricao: 'Foto 3 da galeria' },
    { url: './fotos/4.jpg', descricao: 'Foto 4 da galeria' },
    { url: './fotos/5.jpg', descricao: 'Foto 5 da galeria' },
  ];
  novaFotoUrl = '';
  novaDescricao = '';
  carouselIndex = 0;

  constructor() {
    setInterval(() => {
      if (this.fotos.length > 0) {
        this.carouselIndex =
          (this.carouselIndex + 1) % Math.min(this.fotos.length, 5);
      }
    }, 2500);
  }

  adicionarFoto() {
    if (this.novaFotoUrl && this.novaDescricao) {
      this.fotos.push({ url: this.novaFotoUrl, descricao: this.novaDescricao });
      this.novaFotoUrl = '';
      this.novaDescricao = '';
    }
  }
}
