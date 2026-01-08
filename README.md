# CutLink Pro - Arquitectura del Sistema

CutLink Pro es una plataforma escalable de acortamiento de URLs basada en microservicios. Está diseñada para manejar alto tráfico mediante una arquitectura orientada a eventos, estrategias de caché y actualizaciones en tiempo real.

## 🏗 Resumen de la Arquitectura

El sistema abstrae la complejidad en microservicios dedicados, asegurando aislamiento, escalabilidad y mantenibilidad.

### Servicios

| Servicio | Tecnología | Descripción | Puerto |
| :--- | :--- | :--- | :--- |
| **API Gateway** | Node.js / Express | Punto de entrada para todas las peticiones del cliente. Maneja enrutamiento, proxy de autenticación y limitación de velocidad. | `4000` |
| **URL Service** | Node.js / Express | Lógica central para la gestión de URLs (CRUD). Usa Redis para caché y MySQL para persistencia. | `3001` |
| **Realtime Service** | Node.js / Socket.io | Envía actualizaciones de clicks en vivo al frontend vía WebSockets. Consume eventos de RabbitMQ. | `3005` |
| **URL Worker** | Node.js | Worker en segundo plano que procesa eventos de click desde RabbitMQ y actualiza la base de datos MySQL (Patrón Write-Behind). | N/A |
| **Schedule Sanitation**| Node.js / Cron | Tarea programada que limpia URLs expiradas y realiza mantenimiento de base de datos. | N/A |
| **Frontend** | Angular + Tailwind | Aplicación de página única (SPA) moderna para la interacción del usuario y dashboards. | `4200` |
| **Keycloak** | Java / OpenJDK | Servidor de Gestión de Identidad y Acceso (IAM). Maneja usuarios, roles y tokens JWT. | `8080` |

### Infraestructura y Datos

- **MySQL**: Base de datos principal para almacenar Usuarios y URLs.
- **PostgreSQL**: Base de datos dedicada para Keycloak (Gestión de Identidad).
- **Redis**: Caché de alta velocidad para redirección de URLs y conteo distribuido (Patrón Cache-Aside).
- **RabbitMQ**: Broker de mensajería para desacoplar el procesamiento de clicks (Exchange Fanout: `clicks_fanout`).
- **Keycloak**: Gestión de Identidad y Acceso de Código Abierto para autenticación.


## 🚀 Comenzando

### Prerrequisitos
- Docker y Docker Compose
- Node.js (para desarrollo local fuera de contenedores)

### Ejecutar con Docker (Recomendado)

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-repo/cutlink-pro.git
    cd cutlink-pro
    ```

2.  **Iniciar el entorno**:
    ```bash
    docker compose up -d --build
    ```
    *Esto levantará todos los servicios, bases de datos y brokers de mensajería.*

3.  **Acceder a la aplicación**:
    - Frontend: `http://localhost:4200`
    - API Gateway: `http://localhost:4000`
    - Consola Keycloak: `http://localhost:8080` (Credenciales por defecto: `admin`/`admin`)

---

## 🔄 Flujo de Datos: Conteo de Clicks

1.  El usuario hace click en un enlace corto (manejado por `url-service` vía Gateway).
2.  **Redis** verifica si existe caché. Si no, carga perezosamente (lazy-load) desde la BD.
3.  El contador de clicks se incrementa en **Redis** (Incremento Atómico).
4.  Se publica un evento `{ short_code, clicks }` en **RabbitMQ** (`clicks_fanout`).
5.  **Realtime Service** consume el evento -> Emite mensaje WebSocket -> Frontend actualiza en vivo.
6.  **URL Worker** consume el evento -> Actualiza **MySQL** asíncronamente (Write-Behind).

## 🛡 Seguridad

- **Autenticación**: Validación JWT vía Keycloak.
- **Comunicación Interna**: Asegurada vía headers `x-internal-secret` entre Gateway y Microservicios.
- **Seguridad en Contenedores**: Los servicios corren como usuario no-root (`node`) en Docker.

## 🛠 Desarrollo

Cada servicio tiene su propio `Dockerfile` optimizado para producción (Multi-stage para frontend, Alpine + Hardening de seguridad para backend).

Para trabajar en un servicio específico individualmente, verifica sus requerimientos en el archivo `.env` en su respectivo directorio.
