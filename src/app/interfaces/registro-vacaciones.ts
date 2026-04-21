export interface RegistroVacaciones {
  id: number;
  fechareg: string;
  fecha: string;
  dias: number;
  hasta: string;
  observacion: string;
  ejercicio: string;
  carta: string;
  b64File: string;

  uploadFile: string;
  b64UploadFile: string;
  validar: string;
}
