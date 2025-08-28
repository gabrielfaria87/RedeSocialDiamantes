export class Mensagem {
  constructor(
    public id: number = 0,
    public remetenteId: number = 0,
    public remetenteNome: string = '',
    public destinatarioId: number = 0,
    public conteudo: string = '',
    public data: Date = new Date(),
    public lida: boolean = false
  ) {}
}