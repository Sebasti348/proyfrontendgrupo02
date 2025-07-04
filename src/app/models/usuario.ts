export class Usuario {
    _id!: number;
  nombre?: string;
  apellido?: string;
  username?: string;
  password?: string;
  email?: string;
  rol?: string;
  fechaRegistro?: Date;
  estado?: boolean;
  
  constructor( username:string="", password:string="", nombre:string="", apellido:string="", rol:string="", estado:boolean=true){
    this.username = username;
    this.password = password;
    this.nombre = nombre;
    this.apellido = apellido;
    this.rol = rol;
    }
}
