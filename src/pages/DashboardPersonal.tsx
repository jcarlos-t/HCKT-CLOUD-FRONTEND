// src/pages/DashboardPersonal.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import {
  listarIncidentes,
  actualizarEstadoIncidente,
  type Incidente,
  type EstadoIncidente,
} from "../services/incidentes/incidentes";

const DashboardPersonal: React.FC = () => {
  const navigate = useNavigate();
  const { logout, session } = useAuthContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncidente, setSelectedIncidente] = useState<Incidente | null>(
    null
  );
  const [showCompletarModal, setShowCompletarModal] = useState(false);
  const [detallesCompletado, setDetallesCompletado] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const userResponse = await getMyUser();
          setUsuario(userResponse.data.usuario);

          const incidentesResponse = await listarIncidentes({ size: 100 });
          setIncidentes(incidentesResponse.data.contents);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handleCambiarEstado = async (
    incidenteId: string,
    nuevoEstado: EstadoIncidente
  ) => {
    try {
      await actualizarEstadoIncidente({
        incidente_id: incidenteId,
        estado: nuevoEstado,
      });

      // Actualizar la lista
      const incidentesResponse = await listarIncidentes({ size: 100 });
      setIncidentes(incidentesResponse.data.contents);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("No se pudo actualizar el estado del incidente");
    }
  };

  const handleCompletar = async () => {
    if (!selectedIncidente || !detallesCompletado.trim()) {
      alert("Por favor ingresa los detalles de la solución");
      return;
    }

    try {
      await actualizarEstadoIncidente({
        incidente_id: selectedIncidente.incidente_id,
        estado: "resuelto",
      });

      // Aquí podrías enviar los detalles a un endpoint específico si existe
      // Por ahora, los detalles se guardan en el estado local
      console.log("Detalles de solución:", detallesCompletado);

      // Actualizar la lista
      const incidentesResponse = await listarIncidentes({ size: 100 });
      setIncidentes(incidentesResponse.data.contents);

      setShowCompletarModal(false);
      setSelectedIncidente(null);
      setDetallesCompletado("");
    } catch (error) {
      console.error("Error al completar incidente:", error);
      alert("No se pudo completar el incidente");
    }
  };

  const estadisticas = {
    pendientes: incidentes.filter((i) => i.estado === "pendiente").length,
    enProgreso: incidentes.filter((i) => i.estado === "en_progreso").length,
    resueltos: incidentes.filter((i) => i.estado === "resuelto").length,
    total: incidentes.length,
  };

  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "en_progreso":
        return "bg-blue-100 text-blue-800";
      case "resuelto":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoLabel = (estado?: string) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "en_progreso":
        return "En Progreso";
      case "resuelto":
        return "Resuelto";
      default:
        return "Sin estado";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AU</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  AlertaUTEC
                </h1>
                <p className="text-xs text-slate-500">
                  Panel de Personal Administrativo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {usuario && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {usuario.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      Personal Administrativo
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Gestión de Incidentes
          </h2>
          <p className="text-slate-600">
            Administra todos los incidentes reportados en el campus.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {estadisticas.pendientes}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  En Progreso
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {estadisticas.enProgreso}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Resueltos
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {estadisticas.resueltos}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-slate-900">
                  {estadisticas.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Incidentes */}
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Todos los Incidentes
          </h3>

          {incidentes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No hay incidentes reportados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidentes.map((incidente) => (
                <div
                  key={incidente.incidente_id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {incidente.titulo}
                          </h4>
                          <p className="text-sm text-slate-500">
                            ID: {incidente.incidente_id}
                          </p>
                          {incidente.usuario_correo && (
                            <p className="text-sm text-slate-500">
                              Reportado por: {incidente.usuario_correo}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            incidente.estado
                          )}`}
                        >
                          {getEstadoLabel(incidente.estado)}
                        </span>
                      </div>

                      <p className="text-slate-600 mb-3">
                        {incidente.descripcion}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>
                          📍 Piso {incidente.piso} - ({incidente.ubicacion.x},{" "}
                          {incidente.ubicacion.y})
                        </span>
                        <span>🏷️ {incidente.tipo}</span>
                        <span>⚡ {incidente.nivel_urgencia}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {incidente.estado === "pendiente" && (
                        <button
                          onClick={() =>
                            handleCambiarEstado(
                              incidente.incidente_id,
                              "en_progreso"
                            )
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Marcar en Progreso
                        </button>
                      )}

                      {incidente.estado === "en_progreso" && (
                        <button
                          onClick={() => {
                            setSelectedIncidente(incidente);
                            setShowCompletarModal(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                        >
                          Completar
                        </button>
                      )}

                      {incidente.estado !== "resuelto" &&
                        incidente.estado !== "en_progreso" && (
                          <button
                            onClick={() =>
                              handleCambiarEstado(
                                incidente.incidente_id,
                                "en_progreso"
                              )
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                          >
                            En Progreso
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal para completar con detalles */}
      {showCompletarModal && selectedIncidente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Completar Incidente
            </h3>
            <p className="text-slate-600 mb-2">
              <strong>Incidente:</strong> {selectedIncidente.titulo}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Detalles de la Solución *
              </label>
              <textarea
                value={detallesCompletado}
                onChange={(e) => setDetallesCompletado(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
                placeholder="Describe cómo se resolvió el incidente, qué acciones se tomaron, materiales utilizados, etc."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCompletar}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Completar y Enviar
              </button>
              <button
                onClick={() => {
                  setShowCompletarModal(false);
                  setSelectedIncidente(null);
                  setDetallesCompletado("");
                }}
                className="flex-1 bg-white text-slate-700 border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPersonal;

