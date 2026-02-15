# Gienco Web - Proyecto Intermodular

## Introduccion
Este proyecto consiste en el desarrollo de una aplicacion web oficial para la banda de rock Gienco. El objetivo principal es proporcionar una plataforma digital moderna y robusta que permita a los seguidores de la banda interactuar con su musica, adquirir productos de merchandising y mantenerse informados sobre las ultimas novedades.

Desde una perspectiva tecnica, este proyecto sirve como demostracion de una arquitectura "Serverless" (sin servidor) moderna, utilizando tecnologias de vanguardia en el desarrollo frontend (Vue.js) integradas con servicios en la nube de Amazon Web Services (AWS) para garantizar la seguridad y escalabilidad sin la necesidad de administrar infraestructura compleja.

## Descripcion de la Aplicacion

La aplicacion es una "Single Page Application" (SPA). Esto significa que funciona como una aplicacion de escritorio: no necesita recargar la pagina cada vez que el usuario navega a una nueva seccion. Esto es crucial para la funcionalidad principal del sitio: el reproductor de musica. Gracias a esta arquitectura, la musica continua reproduciéndose sin interrupciones mientras el usuario visita la tienda, lee sobre la banda o navega por el sitio.

### Flujo de la Aplicacion

1.  **Experiencia del Usuario Publico (Fans)**:
    *   Al ingresar, el usuario es recibido con una interfaz visual moderna que refleja la identidad de la banda.
    *   Puede iniciar la reproduccion de canciones inmediatamente a traves del reproductor integrado.
    *   Puede navegar a la seccion de "Tienda" para ver productos (camisetas, discos, accesorios).
    *   Los productos pueden añadirse a un carrito de compras que guarda la seleccion incluso si se cierra el navegador y se vuelve a abrir mas tarde.
    *   El sitio adapta su diseño automaticamente a telefonos moviles, tabletas y ordenadores de escritorio.

2.  **Experiencia del Administrador (Gestion)**:
    *   Existe un area restringida accesible solo para personal autorizado.
    *   Para acceder, el administrador debe autenticarse mediante un sistema seguro proporcionado por AWS Cognito.
    *   Este sistema de seguridad protege la informacion y asegura que solo las personas con credenciales validas puedan acceder al panel de control.

## Funcionalidades Principales

### Reproduccion Continua de Audio
A diferencia de los sitios web tradicionales donde el audio se detiene al cambiar de pagina, esta aplicacion mantiene el reproductor activo en todo momento. Esto crea una experiencia de usuario inmersiva similar a usar aplicaciones como Spotify o Apple Music.

### Sistema de Tienda y Carrito Persistente
La aplicacion incluye una logica de negocio para gestionar un carrito de compras. El estado del carrito (productos seleccionados, cantidades) se guarda en la memoria local del dispositivo del usuario. Esto permite que el usuario pueda salir de la pagina y, al regresar, encontrar su compra tal como la dejo.

### Seguridad y Gestion de Usuarios
La seguridad es un pilar fundamental de este proyecto. En lugar de construir un sistema de seguridad desde cero (lo cual es propenso a errores), se ha integrado **AWS Cognito**.
*   **Autenticacion Segura**: Las contraseñas nunca se almacenan en la aplicacion, sino que son gestionadas por AWS bajo estandares de seguridad de la industria.
*   **Proteccion de Datos**: El intercambio de informacion utiliza protocolos seguros que impiden que atacantes puedan interceptar las credenciales.

## Arquitectura Tecnica

El proyecto sigue una arquitectura de **Monorepo** dividida en dos capas logicas:

### 1. Frontend (La Interfaz)
Desarrollado con **Vue 3**, un framework progresivo de JavaScript. Se ha priorizado la modularidad y el rendimiento.
*   **Vite**: Utilizado para el empaquetado y optimizacion de la aplicacion, asegurando tiempos de carga minimos.
*   **Tailwind CSS**: Framework de diseño que permite una interfaz totalmente personalizada y adaptativa.
*   **Pinia**: Gestor de estado que maneja la logica global de la aplicacion, como el estado del usuario o el contenido del carrito de compras.

### 2. Backend y Cloud (La Infraestructura)
El proyecto utiliza un enfoque **Serverless** sobre AWS. No existen servidores fisicos o virtuales que administrar. Los servicios utilizados son:
*   **Amazon Cognito**: Provee el directorio de usuarios y los servicios de autenticacion. Permite una escalabilidad de millones de usuarios sin configuracion adicional.
*   **AWS IAM (Identity and Access Management)**: Gestiona los permisos y roles de seguridad en la nube.

Esta arquitectura garantiza que la aplicacion sea:
*   **Escalable**: Puede soportar picos de tráfico sin caerse.
*   **Segura**: Delega la seguridad critica a expertos (Amazon).
*   **Eficiente**: Al no tener servidores encendidos las 24 horas, reduce costes y complejidad de mantenimiento.

## Estructura del Proyecto

El codigo fuente esta organizado profesionalmente para facilitar su mantenimiento y escalabilidad futura:

*   **frontend/**: Contiene todo el codigo fuente de la interfaz de usuario, configuraciones de diseño y logica de presentacion.
*   **backend/**: Estructura preparada para futuras ampliaciones de logica de servidor, manteniendo la separacion de responsabilidades.

## Guia de Instalacion y Despliegue

### Requisitos Previos
*   Node.js instalado en el sistema.
*   Acceso a internet para descargar dependencias.

### Pasos para Ejecutar Localmente

1.  Acceder a la carpeta del frontend:
    ```bash
    cd frontend
    ```

2.  Instalar las dependencias del proyecto:
    ```bash
    npm install
    ```

3.  Configurar las variables de entorno:
    Crear un archivo `.env` en la carpeta `frontend` con las credenciales de AWS proporcionadas (User Pool ID y Client ID).

4.  Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    La aplicacion estara accesible en `http://localhost:3000`.

### Generacion para Produccion
Para preparar la aplicacion para un entorno real de produccion:
```bash
npm run build
```
Esto generara una carpeta `dist` con los archivos optimizados listos para ser desplegados en cualquier servidor web o servicio de almacenamiento estatico como AWS S3.
