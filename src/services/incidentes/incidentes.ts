import Api from "../api";

export type TipoIncidente = "mantenimiento" | "seguridad" | string;
export type NivelUrgencia = "bajo" | "medio" | "alto" | string;
export type EstadoIncidente =
  | "pendiente"
  | "en_progreso"
  | "resuelto"
  | string;

export interface Ubicacion {
  x: number;
  y: number;
}

export interface Evidencias {
  file_base64: string;
}

export interface Incidente {
  incidente_id: string;
  titulo: string;
  descripcion: string;
  piso: number;
  ubicacion: Ubicacion;
  tipo: TipoIncidente;
  nivel_urgencia: NivelUrgencia;
  estado?: EstadoIncidente;
  usuario_correo?: string; // solo visible para autoridad/personal
}

/**
 * Crear Incidente (Estudiante)
 * POST /incidentes/crear
 */
export interface CrearIncidenteRequest {
  titulo: string;
  descripcion: string;
  piso: number;
  ubicacion: Ubicacion;
  tipo: TipoIncidente;
  nivel_urgencia: NivelUrgencia;
  evidencias?: Evidencias;
}

export interface CrearIncidenteResponse {
  incidente_id: string;
}

export async function crearIncidente(payload: CrearIncidenteRequest) {
  const api = await Api.getInstance("reportes");

  return api.post<CrearIncidenteRequest, CrearIncidenteResponse>(payload, {
    url: "/incidentes/crear",
  });
}

/**
 * Actualizar Incidente (Estudiante)
 * PUT /incidentes/update
 */
export interface ActualizarIncidenteRequest {
  incidente_id: string;
  titulo: string;
  descripcion: string;
  piso: number;
  ubicacion: Ubicacion;
  tipo: TipoIncidente;
  nivel_urgencia: NivelUrgencia;
}

export async function actualizarIncidente(payload: ActualizarIncidenteRequest) {
  const api = await Api.getInstance("reportes");

  return api.put<ActualizarIncidenteRequest, { incidente: Incidente }>(
    payload,
    {
      url: "/incidentes/update",
    },
  );
}

/**
 * Actualizar Estado de Incidente (Personal)
 * PUT /incidentes/update_estado
 */
export interface ActualizarEstadoIncidenteRequest {
  incidente_id: string;
  estado: EstadoIncidente; // ej: "en_progreso"
}

export async function actualizarEstadoIncidente(
  payload: ActualizarEstadoIncidenteRequest,
) {
  const api = await Api.getInstance("reportes");

  return api.put<
    ActualizarEstadoIncidenteRequest,
    { incidente: Incidente }
  >(payload, {
    url: "/incidentes/update_estado",
  });
}

/**
 * Buscar Incidente (Autoridad)
 * POST /incidentes/buscar
 */
export interface BuscarIncidenteRequest {
  incidente_id: string;
}

export interface BuscarIncidenteResponse {
  incidente: Incidente;
}

export async function buscarIncidente(payload: BuscarIncidenteRequest) {
  const api = await Api.getInstance("reportes");

  return api.post<BuscarIncidenteRequest, BuscarIncidenteResponse>(payload, {
    url: "/incidentes/buscar",
  });
}

/**
 * Listar Incidentes (Estudiante / Autoridad)
 * POST /incidentes/listar
 * body: { size, last_key? }
 * La diferencia la marca el rol del token: autoridad ve usuario_correo, estudiante no.
 */
export interface ListarIncidentesRequest {
  size: number;
  last_key?: string | null;
}

export interface ListarIncidentesResponse {
  contents: Incidente[];
  last_key?: string | null;
}

export async function listarIncidentes(payload: ListarIncidentesRequest) {
  const api = await Api.getInstance("reportes");

  return api.post<ListarIncidentesRequest, ListarIncidentesResponse>(payload, {
    url: "/incidentes/listar",
  });
}
