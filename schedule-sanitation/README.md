# Schedule Sanitation

Un servicio de mantenimiento en segundo plano impulsado por `node-cron`. Mantiene la base de datos saludable eliminando registros expirados o inválidos periódicamente.

## 💻 Tecnologías

- **Runtime**: Node.js
- **Scheduling**: node-cron (Formato estilo Unix)
- **Base de Datos**: MySQL (mysql2)
- **Logs**: Consola estándar (capturada por Docker).

## 🕰 Tareas

- **Limpieza de URLs**: Elimina URLs cuya fecha `expires_at` está en el pasado.
- **Verificación**: Registra el número de registros eliminados para auditoría.

## 🛠 Configuración (.env)

| Variable | Descripción |
| :--- | :--- |
| `DB_HOST` | Host MySQL |
| `DB_USER` | Usuario MySQL |
| `DB_PASSWORD` | Contraseña MySQL |
| `DB_NAME` | Nombre Base de Datos |
| `CRON_SCHEDULE` | Expresión Cron (ej. `*/5 * * * *` para cada 5 mins) |

## 📦 Despliegue

Corre como un proceso ligero de Node.js sin exponer puertos HTTP.
