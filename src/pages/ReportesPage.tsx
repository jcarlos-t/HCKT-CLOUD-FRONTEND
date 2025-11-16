// src/pages/ReportesPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarIncidentes, type Incidente } from "../services/incidentes/incidentes";

const ReportesPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchIncidentes = async () => {
      try {
        setIsLoading(true);
        const response = await listarIncidentes({ size: 50 });
        setIncidentes(response.data.contents);
        setError("");
      } catch (err) {
        console.error("Error al obtener incidentes:", err);
        setError("No se pudieron cargar los reportes. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidentes();
  }, []);

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

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "alto":
        return "bg-red-100 text-red-800";
      case "medio":
        return "bg-orange-100 text-orange-800";
      case "bajo":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-slate-600 hover:text-sky-600 transition"
              >
                ← Volver
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Mis Reportes
                </h1>
                <p className="text-sm text-slate-500">
                  Gestiona todos tus incidentes reportados
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/reportar")}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition"
            >
              + Nuevo Reporte
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            <p className="mt-4 text-slate-600">Cargando reportes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800">{error}</p>
          </div>
        ) : incidentes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No tienes reportes aún
            </h3>
            <p className="text-slate-600 mb-6">
              Comienza reportando un incidente en el campus
            </p>
            <button
              onClick={() => navigate("/dashboard/reportar")}
              className="bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition"
            >
              Crear Primer Reporte
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {incidentes.map((incidente) => (
              <div
                key={incidente.incidente_id}
                className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {incidente.titulo}
                        </h3>
                        <p className="text-sm text-slate-500">
                          ID: {incidente.incidente_id}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            incidente.estado
                          )}`}
                        >
                          {getEstadoLabel(incidente.estado)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(
                            incidente.nivel_urgencia
                          )}`}
                        >
                          {incidente.nivel_urgencia.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-4">{incidente.descripcion}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>
                          Piso {incidente.piso} - ({incidente.ubicacion.x},{" "}
                          {incidente.ubicacion.y})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🏷️</span>
                        <span>{incidente.tipo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportesPage;

