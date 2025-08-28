export class TopicoForum {
  constructor(
    public id: number = 0,
    public titulo: string = '',
    public descricao: string = '',
    public criadorId: number = 0,
    public criadorNome: string = '',
    public criadorAvatar: string = '',
    public dataCriacao: Date = new Date(),
    public mensagens: MensagemForum[] = [],
    public isFixo: boolean = false,
    public categoria: string = 'Geral'
  ) {}
}

export class MensagemForum {
  constructor(
    public id: number = 0,
    public topicoId: number = 0,
    public usuarioId: number = 0,
    public usuarioNome: string = '',
    public usuarioAvatar: string = '',
    public conteudo: string = '',
    public data: Date = new Date(),
    public curtidas: number = 0
  ) {}
}

export class CategoriaForum {
  constructor(
    public id: number = 0,
    public nome: string = '',
    public descricao: string = '',
    public icone: string = '💬'
  ) {}
}