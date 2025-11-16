import Api from "../api";

// Ajusta estos tipos a tus interfaces reales si ya las tienes
export interface Usuario {
  id?: string;
  nombre: string;
  correo: string;
  rol: "estudiante" | "personal_administrativo" | "autoridad";
}

export interface UsuarioResponse {
  usuario: Usuario;
}

export interface ChangePasswordRequest {
  contrasena_actual: string;
  nueva_contrasena: string;
}

export interface ListUsuariosRequest {
  limit: number;
  last_key?: string | null;
}

export interface ListUsuariosResponse {
  contents: Usuario[];
  last_key?: string | null;
}

/**
 * Mi Usuario (GET /usuario/mi)
 */
export async function getMyUser() {
  const api = await Api.getInstance("usuarios");

  return api.get<void, UsuarioResponse>({
    url: "/usuario/mi",
  });
}

/**
 * Modificar Mi Usuario (PUT /usuario/modificar)
 * body:
 * {
 *   correo,
 *   nombre,
 *   contrasena
 * }
 */
export interface UpdateMyUserRequest {
  correo: string;
  nombre: string;
  contrasena: string;
}

export async function updateMyUser(payload: UpdateMyUserRequest) {
  const api = await Api.getInstance("usuarios");

  return api.put<UpdateMyUserRequest, UsuarioResponse>(payload, {
    url: "/usuario/modificar",
  });
}

/**
 * Eliminar Mi Usuario (DELETE /usuario/eliminar)
 * Se usa tanto como estudiante como autoridad/P.A.
 */
export async function deleteUserByCorreo(correo: string) {
  const api = await Api.getInstance("usuarios");

  return api.delete({
    url: "/usuario/eliminar",
    data: { correo },
  });
}

/**
 * Crear Usuario (Autoridad) (POST /usuario/crear)
 * - El mismo endpoint que registro, pero aquí se crea un tercero con rol explícito
 */
export interface CreateUserAsAutoridadRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: "estudiante" | "personal_administrativo" | "autoridad";
}

export async function createUserAsAutoridad(
  payload: CreateUserAsAutoridadRequest,
) {
  const api = await Api.getInstance("usuarios");

  // El token de autoridad ya va en api.authorization
  return api.post<CreateUserAsAutoridadRequest, UsuarioResponse>(payload, {
    url: "/usuario/crear",
  });
}

/**
 * Obtener Usuario (Autoridad / Personal)
 * GET /usuario/obtener?correo=...
 */
export async function getUserByCorreo(correo: string) {
  const api = await Api.getInstance("usuarios");

  return api.get<void, UsuarioResponse>({
    url: "/usuario/obtener",
    params: { correo },
  });
}

/**
 * Cambiar Contraseña (Estudiante)
 * POST /usuario/cambiar-contrasena
 */
export async function changeMyPassword(payload: ChangePasswordRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<ChangePasswordRequest, { ok: boolean }>(payload, {
    url: "/usuario/cambiar-contrasena",
  });
}

/**
 * Listar usuarios (P.A. o Autoridad)
 * POST /usuario/listar
 * body: { limit, last_key }
 */
export async function listUsuarios(payload: ListUsuariosRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<ListUsuariosRequest, ListUsuariosResponse>(payload, {
    url: "/usuario/listar",
  });
}
