# Sistema de Gestión de Gimnasio

Sistema full-stack para la administración de un gimnasio: socios, membresías, pagos, usuarios y configuración de planes.

## Stack

| Capa      | Tecnología |
|-----------|------------|
| Backend   | .NET 10 Web API · Entity Framework Core · SQL Server |
| Auth      | JWT (Bearer) + BCrypt |
| Frontend  | React 19 + Vite |

## Requisitos previos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server Express (o cualquier instancia SQL Server)

## Configuración inicial

### 1. Base de datos

La connection string se configura en `GimnasioAPI/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_SERVIDOR\\SQLEXPRESS;Database=GimnasioDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Aplicar las migraciones:

```bash
cd GimnasioAPI
dotnet ef database update
```

### 2. Secretos (obligatorio)

La clave JWT y el código de invitación admin **no viven en el repositorio**. Se configuran con user-secrets:

```bash
cd GimnasioAPI
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "<clave-aleatoria-de-al-menos-32-caracteres>"
dotnet user-secrets set "AdminInvitationCode" "<tu-codigo-de-invitacion>"
```

Para generar una clave segura:

```powershell
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 64
$rng.GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

Ver los secretos cargados: `dotnet user-secrets list`

> En producción usar variables de entorno (`Jwt__Key`, `AdminInvitationCode`).

### 3. CORS

Los orígenes permitidos del frontend se configuran en `appsettings.json`:

```json
"AllowedOrigins": [ "http://localhost:5173", "http://127.0.0.1:5173" ]
```

## Ejecución

**API** (puerto 5209):

```bash
cd GimnasioAPI
dotnet run
```

**Frontend** (puerto 5173):

```bash
cd GimnasioFrontend
npm install
npm run dev
```

## Tests

**Backend** (xUnit):

```bash
cd GimnasioAPI.Tests
dotnet test
```

> Si la API está corriendo, usar `dotnet test -p:UseAppHost=false "-p:OutputPath=bin/Test/"` para no bloquear los binarios en uso.

**Frontend** (Vitest):

```bash
cd GimnasioFrontend
npm test
```

## Módulos

| Módulo        | Funciones principales |
|---------------|----------------------|
| Socios        | CRUD, búsqueda por nombre/DNI/teléfono, ficha completa, baja lógica, cumpleaños del mes, alerta de vencimientos, export/importación CSV, estadísticas y gráfico de altas por mes |
| Membresías    | Alta con precio según duración, filtro por estado, ordenamiento, renovación, cancelación con historial, suspensión/reactivación, export CSV/PDF, ticket PDF, auditoría de cambios de estado (suspensión, reactivación, cancelación) |
| Pagos         | Efectivo/transferencia/Mercado Pago/tarjeta (validación Luhn), rechazos, anulación con auditoría, saldos y morosos, cierre de caja diario, comparativa mensual, export CSV/PDF, ticket PDF |
| Asistencias   | Registro de entradas (check-in), edición y baja, consulta histórica por socio |
| Clases        | CRUD de clases con horarios múltiples, inscripción y cancelación de socios según plan |
| Empleados     | CRUD con validaciones centralizadas (`EmpleadoValidaciones`) y baja lógica |
| Planes        | Ciclo de vida (activo/inactivo), precios por duración con historial de cambios, beneficios y clases incluidas por plan (catálogo y asignación), export CSV/PDF, auditoría de cambios (alta, edición, pausa/ reactivación, eliminación) |
| Usuarios      | Listado, activar/desactivar, cambio de rol, reset de contraseña, desbloqueo, auditoría de acciones (solo Administrador), catálogo de roles |

## Roles

- **Administrador**: acceso total, incluye gestión de usuarios y precios.
- **Recepcionista**: socios, membresías y pagos.
- **Profesor**: consulta de socios.

## Estructura

```
GIMNASIO/
├── GimnasioAPI/            # Backend .NET
│   ├── Controllers/        # Endpoints por módulo
│   ├── DTOs/               # Contratos de entrada/salida
│   ├── Models/             # Entidades EF Core
│   ├── Data/               # DbContext
│   ├── Services/           # Validaciones de negocio, guards y tokens
│   ├── Settings/           # Clases de configuración (JWT)
│   ├── Migrations/         # Migraciones EF
│   └── Program.cs          # Configuración y middleware
└── GimnasioFrontend/       # SPA React
    └── src/
        ├── components/     # Componentes por módulo
        ├── hooks/          # useGymApp (estado global), useUsuarios
        ├── pages/          # LoginPage, DashboardPage
        ├── services/       # Acceso a API
        └── utils/          # Lógica compartida (pagos, planes, fechas, etc.)
```
