// src/pages/DashboardAutoridad.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import {
  listarIncidentes,
  type Incidente,
} from "../services/incidentes/incidentes";

const DashboardAutoridad: React.FC = () => {
  const navigate = useNavigate();
  const { logout, session } = useAuthContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Análisis y estadísticas
  const analitica = {
    total: incidentes.length,
    porEstado: {
      pendientes: incidentes.filter((i) => i.estado === "pendiente").length,
      enProgreso: incidentes.filter((i) => i.estado === "en_progreso").length,
      resueltos: incidentes.filter((i) => i.estado === "resuelto").length,
    },
    porTipo: incidentes.reduce((acc, inc) => {
      acc[inc.tipo] = (acc[inc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    porUrgencia: incidentes.reduce((acc, inc) => {
      acc[inc.nivel_urgencia] = (acc[inc.nivel_urgencia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    porPiso: incidentes.reduce((acc, inc) => {
      acc[inc.piso] = (acc[inc.piso] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    tasaResolucion:
      incidentes.length > 0
        ? (
            (incidentes.filter((i) => i.estado === "resuelto").length /
              incidentes.length) *
            100
          ).toFixed(1)
        : "0",
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
                <p className="text-xs text-slate-500">Panel de Analítica</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {usuario && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {usuario.nombre}
                    </p>
                    <p className="text-xs text-slate-500">Autoridad</p>
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
            Analítica de Reportes y Soluciones
          </h2>
          <p className="text-slate-600">
            Análisis completo de incidentes y tendencias en el campus.
          </p>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Incidentes
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {analitica.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Tasa de Resolución
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {analitica.tasaResolucion}%
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
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {analitica.porEstado.pendientes}
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
                  {analitica.porEstado.enProgreso}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </div>
        </div>

        {/* Análisis por Categorías */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Por Tipo */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Incidentes por Tipo
            </h3>
            <div className="space-y-3">
              {Object.entries(analitica.porTipo).map(([tipo, cantidad]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-slate-700 capitalize">{tipo}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-sky-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (cantidad / analitica.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">
                      {cantidad}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Por Urgencia */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Incidentes por Urgencia
            </h3>
            <div className="space-y-3">
              {Object.entries(analitica.porUrgencia).map(
                ([urgencia, cantidad]) => (
                  <div
                    key={urgencia}
                    className="flex items-center justify-between"
                  >
                    <span className="text-slate-700 capitalize">{urgencia}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            urgencia === "alto"
                              ? "bg-red-600"
                              : urgencia === "medio"
                              ? "bg-orange-600"
                              : "bg-green-600"
                          }`}
                          style={{
                            width: `${
                              (cantidad / analitica.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-8 text-right">
                        {cantidad}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Por Piso */}
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Incidentes por Piso
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(analitica.porPiso)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([piso, cantidad]) => (
                <div
                  key={piso}
                  className="text-center p-4 bg-sky-50 rounded-lg"
                >
                  <p className="text-2xl font-bold text-sky-600">{cantidad}</p>
                  <p className="text-sm text-slate-600">Piso {piso}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Resumen de Estados */}
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Resumen de Estados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700 mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">
                {analitica.porEstado.pendientes}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {analitica.total > 0
                  ? (
                      (analitica.porEstado.pendientes / analitica.total) *
                      100
                    ).toFixed(1)
                  : 0}
                % del total
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">En Progreso</p>
              <p className="text-2xl font-bold text-blue-900">
                {analitica.porEstado.enProgreso}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {analitica.total > 0
                  ? (
                      (analitica.porEstado.enProgreso / analitica.total) *
                      100
                    ).toFixed(1)
                  : 0}
                % del total
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-1">Resueltos</p>
              <p className="text-2xl font-bold text-green-900">
                {analitica.porEstado.resueltos}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {analitica.total > 0
                  ? (
                      (analitica.porEstado.resueltos / analitica.total) *
                      100
                    ).toFixed(1)
                  : 0}
                % del total
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAutoridad;

