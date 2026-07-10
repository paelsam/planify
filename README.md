# Planify

Aplicación web para que estudiantes universitarios planifiquen sesiones de estudio: organizar materias por categoría, fijar metas por sesión y revisar el avance semanal.

Prototipo funcional (v1.0) desarrollado como trabajo de grado en Ingeniería de Sistemas. La interfaz usa un estilo neobrutalista; el diseño de textos (UX Writing) está documentado y evaluado con pruebas de usabilidad.

## Funcionalidades

- Ingreso con Google (modo demo)
- Panel con métricas, progreso semanal y guía de primeros pasos
- Gestión de categorías académicas
- Creación y edición de materias
- Planificación de sesiones con metas, horarios y recordatorios
- Validaciones de formulario y estados vacíos orientadores
- Persistencia local en el navegador (`localStorage`)

## Stack

- React 18 + TypeScript
- React Router 7
- Vite 6
- Tailwind CSS 4
- Radix UI, Lucide, Sonner, Motion

## Requisitos

- Node.js 18 o superior (recomendado 20+)
- npm, pnpm o bun

## Instalación y ejecución

```bash
# Con npm
npm install
npm run dev

# Con bun (lockfile incluido)
bun install
bun run dev
```

Compilar para producción:

```bash
npm run build
```

El servidor de desarrollo de Vite abre la app en el puerto que indique la terminal (por defecto `http://localhost:5173`).

## Rutas principales

| Ruta | Vista |
| :--- | :---- |
| `/login` | Acceso (Google simulado) |
| `/` | Panel / dashboard |
| `/sesiones` | Sesiones de estudio |
| `/categorias` | Categorías académicas |

## Estructura del proyecto

```
src/app/
  pages/          # Login, Dashboard, Sessions, Categories
  components/     # Modales, tarjetas, UI compartida
  utils/          # storage.ts (modelo de datos y CRUD)
  routes.ts       # Enrutamiento
docs/             # Backlog, UX Writing, pruebas de usabilidad
```

## Limitaciones del prototipo

- La autenticación con Google es simulada; no hay backend ni sincronización entre dispositivos.
- Los datos se guardan solo en `localStorage` del navegador.
- Pensado para demo, pruebas y evaluación académica, no para producción sin ampliar la arquitectura.

## Diseño original

La base visual proviene del diseño en Figma *Neobrutalist Study Planner App*:
https://www.figma.com/design/3rCfP4ZKkvS5z4UBhsrDk6/Neobrutalist-Study-Planner-App
