---
title: "Articulo de prueba"
date: 2026-04-23
draft: false
summary: "Post de prueba para validar el flujo Hugo + GitLab Pages."
tags: ["prueba", "devlog"]

---

## Contexto

Este articulo se ha creado como prueba del flujo de publicacion del blog en FreeOS.me.

## Cambios realizados

- Se creo un nuevo post en formato Markdown dentro de la carpeta de contenido de Hugo.
- El campo `draft` esta en `false` para que Hugo lo incluya en el build.
- Se agrego resumen y etiquetas para validar metadata basica.

## Validacion esperada

Despues de hacer commit y push, el pipeline debe:

- Compilar el blog con Hugo.
- Publicar este articulo en `/blog/`.
- Mostrarlo en el listado principal del blog por fecha.

## Siguientes pasos

1. Revisar el resultado visual en produccion.
2. Ajustar estilo y estructura de contenido segun necesidades.
3. Reutilizar esta plantilla para futuros devlogs.
