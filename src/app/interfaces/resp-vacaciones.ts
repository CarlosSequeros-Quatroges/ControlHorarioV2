import { RegistroVacaciones } from './registro-vacaciones';

export interface RespVacaciones {
  errnum: number;
  errdesc: string;
  msg: string;
  empresa: string;
  matricula: string;
  ejercicio: string;
  desde: string;
  hasta: string;
  diasAsignados: number;
  totalDias: number;
  disfrutados: number;
  pendientes: number;

  vacaciones: RegistroVacaciones[];
}
