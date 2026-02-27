import { RegistroVacaciones } from './registro-vacaciones';

export interface RespVacaciones {
  errnum: number;
  errdesc: string;
  msg: string;
  empresa: string;
  matricula: string;
  ejercicio: string;
  vacaciones: RegistroVacaciones[];
}
