# CutLink App (Frontend)

La interfaz de usuario para CutLink Pro, construida con **Angular (v19)** y **TailwindCSS**. Proporciona un panel amigable para gestionar enlaces cortos y ver analíticas en tiempo real.

## 🌟 Características

- **Gestión de Enlaces**: Crear, editar y eliminar URLs cortas.
- **Analítica en Tiempo Real**: Visualiza conteos de clicks actualizándose en vivo vía WebSockets (Socket.io).
- **Autenticación**: Integrado con Keycloak para login/registro seguro.
- **Diseño Responsivo**: UI/UX Mobile-first.

## 🛠 Configuración de Desarrollo

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Iniciar Servidor de Desarrollo**:
    ```bash
    npm start
    # Abre en http://localhost:4200
    ```

## 🐳 Despliegue con Docker

El Dockerfile usa una estrategia de **Construcción Multi-Etapa (Multi-Stage Build)** para máxima eficiencia:

1.  **Etapa de Construcción**: Usa `node:alpine` para compilar Angular en assets estáticos.
2.  **Etapa de Producción**: Usa `nginx:alpine` para servir los archivos de uso.

El tamaño final de la imagen es extremadamente pequeño (<50MB) comparado con un contenedor Node completo.

```bash
# Construir
docker build -t cutlink-frontend .

# Ejecutar
docker run -p 4200:80 cutlink-frontend
```
