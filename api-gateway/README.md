# API Gateway

El API Gateway es el punto de entrada central para el ecosistema de microservicios de CutLink Pro. Maneja el enrutamiento de peticiones, verificación de autenticación mediante proxies de Keycloak e inyección de headers de seguridad.

## 💻 Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js
- **Proxy**: http-proxy-middleware
- **Seguridad**: Helmet, CORS
- **Auth**: express-oauth2-jwt-bearer (Validación JWT)

## 🔑 Características Clave

- **Proxy Inverso**: Usa `http-proxy-middleware` para enrutar peticiones al `url-service` y al servicio `realtime`.
- **Autenticación**: Valida tokens JWT usando `express-oauth2-jwt-bearer` (Keycloak).
- **Seguridad**:
    - Inyecta el `x-user-id` desde el token JWT en los headers para los servicios posteriores.
    - Añade `x-internal-secret` para asegurar la comunicación entre servicios.
- **Soporte WebSocket**: Proxies para actualizaciones de Socket.io hacia el servicio Realtime.

## 🛠 Configuración (.env)

| Variable | Descripción | Ejemplo/Defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto del Servicio | `4000` |
| `AUTH_ISSUER` | URL del Emisor Keycloak | `http://keycloak:8080/realms/cutlink_reaml` |
| `URL_SERVICE_URL` | URL del URL Service | `http://url-service:3001` |
| `REALTIME_URL` | URL del Realtime Service | `http://realtime:3005` |
| `INTERNAL_SECRET` | Secreto para auth entre servicios | `secret` |

## 🚀 Ejecutar Localmente

```bash
npm install
npm start
```

## 🐳 Ejecutar con Docker

Este servicio corre como un usuario no-root (`node`) y expone un endpoint de salud en `/health`.

```bash
docker build -t cutlink-gateway .
docker run -p 4000:4000 cutlink-gateway
```
