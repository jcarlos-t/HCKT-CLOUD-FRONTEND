export type UserRole = 'estudiante' | 'personal_administrativo' | 'autoridad';

export interface User {
  id: string;
  email: string;
  name: string;
  rol: UserRole;
}

export type IncidentStatus = 'pendiente' | 'en_atencion' | 'resuelto';

export type IncidentType = 
  | 'infraestructura' 
  | 'servicios' 
  | 'emergencia' 
  | 'seguridad' 
  | 'limpieza' 
  | 'otros';

export type UrgencyLevel = 'baja' | 'media' | 'alta' | 'critica';

export interface Incident {
  id: string;
  type: IncidentType;
  location: string;
  description: string;
  urgency: UrgencyLevel;
  status: IncidentStatus;
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  assignedTo?: string;
  history?: IncidentHistory[];
}

export interface IncidentHistory {
  action: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

