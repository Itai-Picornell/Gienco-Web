# Gienco Web - Proyecto Intermodular

## Introducción
Este proyecto consiste en el desarrollo de una aplicación web oficial para la banda de rock Gienco. El objetivo principal es proporcionar una plataforma digital moderna y robusta que permita a los seguidores de la banda interactuar con su música, adquirir productos de merchandising y mantenerse informados sobre las últimas novedades.

Desde una perspectiva técnica, este proyecto es una **Single Page Application (SPA)** desarrollada con **Vue.js**, que se conecta a una infraestructura **Serverless** en AWS gestionada manualmente.

## Descripción de la Aplicación

La aplicación funciona como una aplicación de escritorio: no necesita recargar la página cada vez que el usuario navega a una nueva sección. Esto es crucial para la funcionalidad principal del sitio: el reproductor de música, que continúa reproduciéndose sin interrupciones mientras el usuario visita la tienda, lee sobre la banda o navega por el sitio.

### Flujo de la Aplicación

1.  **Experiencia del Usuario Público (Fans)**:
    *   Interfaz visual moderna y "dark mode".
    *   Reproductor de música continuo.
    *   Tienda de merchandising con carrito persistente.
    *   Diseño responsivo (Móvil, Tablet, Desktop).

2.  **Experiencia del Administrador (Gestión)**:
    *   Área restringida protegida por **AWS Cognito**.
    *   Panel de gestión de pedidos.

## Arquitectura Técnica

### 1. Frontend (La Interfaz)
Desarrollado con **Vue 3** y alojado en la raíz del repositorio:
*   **Vite**: Empaquetado y servidor de desarrollo optimizado.
*   **Tailwind CSS**: Diseño personalizado y adaptativo.
*   **Pinia**: Gestión de estado global (carrito, usuario).

### 2. Backend y Cloud (La Infraestructura)
La infraestructura está alojada en **AWS (Región eu-south-2)** y se gestiona manualmente:
*   **Amazon Cognito**: Autenticación de usuarios y administradores.
*   **AWS Lambda**: Lógica de negocio para procesar pedidos.
*   **Amazon API Gateway**: Punto de entrada para las peticiones del frontend.
*   **Amazon DynamoDB**: Base de datos NoSQL para almacenar pedidos.
*   **Amazon S3 + CloudFront**: Alojamiento y distribución de contenido estático (Frontend).

## Estructura del Proyecto

El proyecto sigue una estructura limpia de **Single Page Application**:

*   **`src/`**: Código fuente Vue.js (vistas, componentes, stores).
*   **`public/`**: Archivos estáticos públicos.
*   **`.env`**: Configuración de variables de entorno (API URLs, Cognito IDs).

## Guía de Instalación y Despliegue

### Requisitos Previos
*   Node.js instalado.
*   Acceso a internet.

### Pasos para Ejecutar Localmente

1.  Instalar las dependencias:
    ```bash
    npm install
    ```

2.  Configurar variables de entorno:
    Asegúrate de tener un archivo `.env` en la raíz con:
    ```ini
    VITE_USER_POOL_ID=...
    VITE_USER_POOL_CLIENT_ID=...
    VITE_API_URL=...
    VITE_LAMBDA_ORDER_URL=...
    VITE_API_ORDERS_URL=...
    ```

3.  Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    La aplicación estará accesible en `http://localhost:5173` (o el puerto que indique Vite).
    > **Nota:** El comando `dev` limpia automáticamente la carpeta `dist/` antes de iniciar.

### Generación para Producción

Para preparar la aplicación para despliegue:
```bash
npm run build
```
Esto generará una carpeta `dist` con los archivos optimizados listos para subir a **AWS S3**.

## Automatización (CI/CD)

El proyecto incluye un flujo de trabajo de **GitHub Actions** (`.github/workflows/deploy.yml`) que despliega automáticamente a S3 cada vez que haces `push` a la rama `main`.

### Configuración Requerida en GitHub

Debes añadir los siguientes **Secretos** en tu repositorio (Settings > Secrets and variables > Actions):

1.  `AWS_ACCESS_KEY_ID`: Tu clave de acceso de AWS.
2.  `AWS_SECRET_ACCESS_KEY`: Tu clave secreta de AWS.
3.  `AWS_REGION`: Tu región (ej. `eu-south-2`).
4.  `AWS_S3_BUCKET`: El nombre de tu bucket (ej. `gienco-web-frontend`).
