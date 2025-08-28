export class Usuario {
  constructor(
    public id: number = 0,
    public nome: string = '',
    public email: string = '',
    public senha: string = '',
    public avatar: string = 'assets/avatar-padrao.jpg',
    public isOnline: boolean = false,
    public isAdmin: boolean = false
  ) {}
}