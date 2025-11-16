import Api from "../api";

export type TipoArea = "ti" | "mantenimiento" | "seguridad" | string;
export type EstadoEmpleado = "activo" | "inactivo" | string;

export interface EmpleadoContacto {
  telefono: string;
  correo: string;
}

export interface Empleado {
  empleado_id?: string;
  nombre: string;
  tipo_area: TipoArea;
  estado: EstadoEmpleado;
  contacto: EmpleadoContacto;
}

export interface CrearEmpleadoRequest {
  nombre: string;
  tipo_area: TipoArea;
  estado: EstadoEmpleado;
  contacto: EmpleadoContacto;
}

export interface CrearEmpleadoResponse {
  empleado: Empleado;
}

export interface ListarEmpleadosRequest {
  limit: number;
  last_key?: string | null;
  estado?: EstadoEmpleado;
}

export interface ListarEmpleadosResponse {
  contents: Empleado[];
  last_key?: string | null;
}

/**
 * Crear empleado (P.A. o Autoridad)
 * POST /empleados/crear
 */
export async function crearEmpleado(payload: CrearEmpleadoRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<CrearEmpleadoRequest, CrearEmpleadoResponse>(payload, {
    url: "/empleados/crear",
  });
}

/**
 * Listar Empleados (P.A. o Autoridad)
 * POST /empleados/listar
 */
export async function listarEmpleados(payload: ListarEmpleadosRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<ListarEmpleadosRequest, ListarEmpleadosResponse>(payload, {
    url: "/empleados/listar",
  });
}
