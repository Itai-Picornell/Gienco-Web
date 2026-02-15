# Arquitectura Backend (Serverless)

## ¿Por qué esta carpeta no contiene código tradicional?

Este proyecto ha sido diseñado utilizando una arquitectura **Serverless** (sin servidor) moderna, delegando la lógica de backend a servicios gestionados en la nube de **Amazon Web Services (AWS)**.

A diferencia de una arquitectura tradicional monolítica donde tendríamos un servidor (Node.js, PHP, Java) corriendo permanentemente, aquí utilizamos servicios bajo demanda.

## Servicios Implementados

La funcionalidad de backend actual está cubierta por:

1.  **AWS Cognito**: Gestiona toda la lógica de:
    *   Base de datos de usuarios.
    *   Autenticación segura (Login/Registro).
    *   Gestión de sesiones (Tokens JWT).
    *   Recuperación de contraseñas.
    *   Seguridad contra ataques de fuerza bruta.

2.  **AWS IAM (Identity and Access Management)**:
    *   Gestiona los roles y permisos de acceso a los recursos.

## Evolución Futura

Esta carpeta `backend/` se mantiene en la estructura del proyecto como parte de una planificación profesional escalable. Está reservada para alojar:

*   **APIs REST/GraphQL**: Si en el futuro se requiere lógica de negocio compleja no cubierta por servicios AWS (ej. Node.js con Express o NestJS).
*   **AWS Lambda Functions**: Código de funciones serverless para tareas específicas.
*   **Infraestructura como Código (IaC)**: Scripts de Terraform o AWS CDK para automatizar el despliegue de recursos.

---
*Este enfoque demuestra capacidad de integración con tecnologías Cloud y diseño de arquitecturas modernas y eficientes.*
