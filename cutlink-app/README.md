# CutLink App (Frontend)

La interfaz de usuario para CutLink Pro, construida con **Angular (v19)** y **TailwindCSS**. Proporciona un panel amigable para gestionar enlaces cortos y ver analíticas en tiempo real.

## 📸 Screenshots

<table>
  <tr>
    <td width="33%"><img src="https://drive.google.com/thumbnail?id=1sl0WWF-x5lRzeSvZ6Py2d-x5A4-TwJ0O&sz=w800" alt="screenshot1" /></td>
    <td width="33%"><img src="https://drive.google.com/thumbnail?id=1yURrZDH0pfg4B5OPC4FKGaj_x1WQKgnZ&sz=w800" alt="screenshot2" /></td>
    <td width="33%"><img src="https://drive.google.com/thumbnail?id=1IvNdrn-WvutQzNM8e3D940WYZtYABNzH&sz=w800" alt="screenshot3" /></td>
  </tr>
  <tr>
    <td width="33%"><img src="https://drive.google.com/thumbnail?id=1zjtVnQvkWRG-aqWwv6FrxZvrhUI7piEB&sz=w800" alt="screenshot4" /></td>
    <td width="33%"><img src="https://drive.google.com/thumbnail?id=1PbAwTP3uti9YN_HZtTW4ohgHyDVdUpOI&sz=w800" alt="screenshot5" /></td>
    <td width="33%"><img src="https://drive.google.com/thumbnail?id=1ruiCmYOOC-1M95h6rm-UCprRHxmPDrF_&sz=w800" alt="screenshot6" /></td>
  </tr>
</table>


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
