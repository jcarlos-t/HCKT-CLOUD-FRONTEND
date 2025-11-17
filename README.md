# 🏫 AlertaUTEC – Sistema de Reporte y Gestión de Incidentes

AlertaUTEC es una aplicación web diseñada para que **estudiantes, personal administrativo y autoridades** puedan **reportar, gestionar y monitorear incidentes** dentro del campus universitario.

El proyecto está dividido en un **frontend en React + Vite** y un **backend en AWS (API Gateway + Lambdas + DynamoDB)**.

---

## 🚀 Características Principales

### 👤 **Estudiantes**

* Registrar nuevos incidentes.
* Ver el estado de sus reportes (Reportado → En Progreso → Resuelto).
* Ver detalles como ubicación, piso, urgencia y tipo.

### 👨‍🔧 **Personal Administrativo**

* Listar todos los incidentes.
* Cambiar estado a **en_progreso** (incluye asignación automática de empleado).
* Completar incidentes con detalles de resolución.
* Ver estadísticas de estados.

### 🏛️ **Autoridades**

* Consultar incidentes específicos.
* Monitorear métricas del campus.

---

## 🧩 Tecnologías Utilizadas

### **Frontend**

* React + Vite + TypeScript
* TailwindCSS
* React Router
* Context API (sesiones)
* Axios para comunicación con el backend

### **Backend (AWS)**

* API Gateway
* Lambda Functions (Node)
* DynamoDB
* Amazon S3 (evidencias)
* AWS Cognito (autenticación JWT)

---

## 📦 Estructura del Proyecto (Frontend)

```
src/
 ├─ components/       # Componentes UI reutilizables
 ├─ pages/            # Páginas completas por rol
 ├─ contexts/         # Contextos globales (Auth)
 ├─ services/         # Conexión a API (incidentes, usuario)
 ├─ types/            # Tipos globales y modelos
 ├─ api/              # Configuración Axios + tokens
 └─ assets/           # Imágenes, iconos, estáticos
```

---

## 🔌 Endpoints Principales (Backend)

### **Incidentes**

| Método | Endpoint                    | Descripción                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/incidentes/crear`         | Crear incidente (estudiante) |
| PUT    | `/incidentes/update`        | Actualizar un incidente      |
| PUT    | `/incidentes/update_estado` | Cambiar estado (personal)    |
| POST   | `/incidentes/buscar`        | Buscar incidente por ID      |
| POST   | `/incidentes/listar`        | Listar incidentes (paginado) |

### **Usuarios**

| Método | Endpoint      | Descripción                              |
| ------ | ------------- | ---------------------------------------- |
| GET    | `/usuario/me` | Obtener información del usuario logueado |

---

## 🛠️ Instalación y Ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/jcarlos-t/HCKT-CLOUD-FRONTEND.git
cd HCKT-CLOUD-FRONTEND
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear `.env`:

```
VITE_API_URL=https://<api-gateway-url>/dev
```

### 4️⃣ Ejecutar en desarrollo

```bash
npm run dev
```

### 5️⃣ Construir para producción

```bash
npm run build
```

---

## 🔐 Autenticación

La aplicación usa **JWT tokens entregados por el backend**.
El token se guarda en:

* `localStorage`
* Se inyecta automáticamente en los headers de Axios (`Authorization: Bearer <token>`)

---

## 🧪 Flujo General del Sistema

1. **Estudiante reporta incidente**
2. Incidente queda en estado `reportado`
3. Personal administrativo lo marca como `en_progreso`
   → se requiere `empleado_correo`
4. Personal completa el incidente y pasa a `resuelto`
5. Estudiantes y autoridades pueden consultar el historial

---

## 📊 Tipos Principales del Sistema

### Estado de Incidentes

* `reportado`
* `en_progreso`
* `resuelto`

### Tipo de Incidente

* `mantenimiento`
* `seguridad`
* `limpieza`
* `TI`
* `otro`

### Urgencia

* `bajo`
* `medio`
* `alto`
* `critico`

---

## 👥 Autores

Proyecto desarrollado para **UTEC** como parte del hackathon académico.