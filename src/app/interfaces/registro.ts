export interface Registro {
  id?: string;
  codigo?: string;
  matricula?: string;

  inicio?: string;
  manual_inicio?: string; // S|N
  usuario_inicio?: string;
  timestamp_inicio?: string;

  final?: string;
  manual_final?: string; // S|N
  usuario_final?: string;
  timestamp_final?: string;

  duracion?: string;

  jornada_duracion?: string;
  jornada_inicio?: string;
  jornada_final?: string;

  validado?: string;
  usuario_validado?: string;

  tipo?: string;

  inicio_hash_id?: number;
  final_hash_id?: number;
  hextra?: string;

  fecha?: string;
  actualizar?: boolean;

  modoIniFinAutoMan?: string;

  modifica_inicio?: string;
  modifica_final?: string;
}
