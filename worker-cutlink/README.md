# URL Worker

Este es un servicio worker en segundo plano responsable del patrón **Write-Behind** en la arquitectura de conteo de clicks.

## 💻 Tecnologías

- **Runtime**: Node.js
- **Mensajería**: RabbitMQ (amqplib)
- **Base de Datos**: MySQL (mysql2)
- **Patrón**: Write-Behind (Escritura diferida)

## ⚙️ Funcionalidad

1.  **Consume**: Se suscribe al exchange `clicks_fanout` (cola: `clisksa`).
2.  **Buffering/Procesamiento**: Recibe eventos de click de alto volumen desde RabbitMQ.
3.  **A Base de Datos**: Actualiza la base de datos SQL (MySQL) con los nuevos conteos de forma asíncrona.

## 💡 ¿Por qué usar un Worker?
Aislar las escrituras a BD en un worker permite que el `url-service` (redirección) sea extremadamente rápido porque no espera a la operación de escritura lenta de SQL. Solo actualiza Redis y dispara un evento.

## 🛠 Configuración (.env)

| Variable | Descripción |
| :--- | :--- |
| `RABBITMQ_URL` | Cadena de conexión |
| `RABBITMQ_QUEUE` | Nombre de la cola |
| `DB_HOST` | Host Base de Datos |

## 🛡 Health Check

Implementa un chequeo de salud basado en proceso (`ps aux | grep node`) en su Dockerfile para asegurar que el proceso está activo.
