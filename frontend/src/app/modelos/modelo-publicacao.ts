export class Publicacao {
  constructor(
    public id: number = 0,
    public usuarioId: number = 0,
    public usuarioNome: string = '',
    public usuarioAvatar: string = '',
    public conteudo: string = '',
    public data: Date = new Date(),
    public curtidas: number = 0,
    public comentarios: Comentario[] = []
  ) {}
}

export class Comentario {
  constructor(
    public id: number = 0,
    public usuarioId: number = 0,
    public usuarioNome: string = '',
    public usuarioAvatar: string = '',
    public conteudo: string = '',
    public data: Date = new Date()
  ) {}
}