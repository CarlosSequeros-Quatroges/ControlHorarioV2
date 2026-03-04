import { Injectable  } from "@angular/core"

@Injectable (
    {providedIn: 'root',}
)
export class UsuarioModel {
  id: string = ''
  codigo: string = ''
  matricula: string = ''
  nombre: string = ''
  email: string = ''
  token_api: string = ''
  valido_hasta: string = ''
  force: number = 0
  admin: boolean = false
  admin_user: string  = ''

  constructor() {
      this.id = ''
      this.codigo = ''
      this.matricula = ''
      this.nombre = ''
      this.email = ''
      this.token_api = ''
      this.valido_hasta = ''
      this.force = 0
      this.admin = false
      this.admin_user = ''

  }
}
