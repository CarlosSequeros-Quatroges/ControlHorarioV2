import { Registro } from "./registro"

export interface RespIncidencias {
  errnum: number
  errdesc: string
  msg: string
  incidencias: Registro[]
}
