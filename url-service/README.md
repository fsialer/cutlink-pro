# URL Service

El servicio backend principal de CutLink Pro. Gestiona el ciclo de vida de las URLs Cortas y maneja la lógica de redirección.

## 💻 Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MySQL (mysql2)
- **Caché**: Redis (ioredis/redis)
- **Mensajería**: RabbitMQ (amqplib)
- **ID Gen**: nanoid (IDs cortos únicos)

## 🧠 Lógica Central

### 1. Creación de URL
- Genera un Código Corto único de 6 caracteres (`nanoid`).
- Almacena metadatos en MySQL.
- Establece política de expiración (Defecto: 1 año).

### 2. Redirección de Alta Performance
- **Estrategia de Caché**: Implementa el patrón **Cache-Aside** usando Redis.
    - *Lectura*: Revisa Redis primero -> Si encuentra, retorna -> Si no, lee, BD y guarda en Redis.
- **Conteo de Clicks**: Usa un patrón **Write-Behind**.
    - Incrementa el contador en Redis inmediatamente (Atómico).
    - Publica evento a RabbitMQ para persistencia asíncrona en BD.
    - Evita que las escrituras en BD bloqueen el tiempo de respuesta de la redirección.

## 🛠 Configuración (.env)

| Variable | Descripción |
| :--- | :--- |
| `PORT` | Puerto del Servicio (`3001`) |
| `DB_HOST` | Host MySQL |
| `DB_NAME` | Nombre Base de Datos |
| `REDIS_HOST` | Host Redis |
| `RABBITMQ_URL` | Conexión RabbitMQ |

## 🚀 Ejecutar con Docker

Incluye healthchecks necesarios y corre como un usuario no-root.

```bash
docker build -t cutlink-url-service .
docker run -p 3001:3001 cutlink-url-service
```
