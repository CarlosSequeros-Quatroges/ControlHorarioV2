import { Registro } from "./registro";
import { RegistroModo } from "./registro-modo";

export interface DatosCtrlRegistro {
  bloqueado: boolean;
  modo: RegistroModo;
  administrador: boolean;
}

