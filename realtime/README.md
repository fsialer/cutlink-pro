# Realtime Service

Este microservicio proporciona actualizaciones en tiempo real al frontend usando WebSockets. Actúa como un puente entre el bus de eventos (RabbitMQ) y la interfaz del cliente.

## 📡 Cómo Funciona

1.  **Consume**: Escucha el exchange `clicks_fanout` en RabbitMQ esperando eventos de click.
2.  **Procesa**: Extrae el `owner_id` y el `short_code` del mensaje.
3.  **Emite**: Envía una actualización vía Socket.io a la sala específica del dueño de la URL.

## 🛠 Configuración (.env)

| Variable | Descripción |
| :--- | :--- |
| `PORT` | Puerto del Servicio (Defecto: `3005`) |
| `RABBITMQ_URL` | Cadena de conexión (ej. `amqp://rabbitmq`) |
| `RABBITMQ_QUEUE` | Nombre de la cola a enlazar (ej. `clicksb`) |
| `RABBITMQ_EXCHANGE` | Exchange a escuchar (`clicks_fanout`) |
| `EVENT_WEBSOCKET` | Nombre del evento a emitir (`click-update`) |

## 🛡 Health Check

Incluye un endpoint `GET /health` usado por Docker para verificar que el servicio está activo.
