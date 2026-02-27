import { Jornada } from "./jornada"
import { Registro } from "./registro"

export interface RespRegistros {
  errnum: number
  errdesc: string
  msg: string
  registro_actual: Registro
  registros: Registro[]
  fechas: string[]
  vacaciones: string[]
  incidencias: number
  festivos: string[]
  jornadas: Jornada[]
  laborable:  string
  minmes:string
  maxmes:string
}
