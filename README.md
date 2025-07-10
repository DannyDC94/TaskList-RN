# Lista de Tareas - React Native App

Una aplicación móvil para gestionar tus tareas diarias, desarrollada con **React Native**, **Zustand**, **Zod** y **TanStack Query**.

---

## Tecnologías utilizadas

- **React Native**: Framework principal para el desarrollo de la app móvil.
- **Zustand**: Manejo global de estado simple y eficiente.
- **Zod**: Validación de esquemas para garantizar datos consistentes.
- **TanStack Query** (React Query): Manejo de fetching, caching y sincronización de datos asincrónicos.

---

## Funcionalidades principales

- Crear, editar y eliminar tareas.
- Marcar tareas como completadas.
- Validación de formularios con Zod.
- Manejo del estado global con Zustand.
- Peticiones y sincronización con backend usando TanStack Query.

---

## Estructura del proyecto

src/
├── components/         # Componentes reutilizables
├── views/              # Pantallas principales (Lista, Crear/Editar)
├── hooks/              # Funcionalidades de la app
├── store/              # Estado global con Zustand
├── routes/             # Rutas de la aplicación usando React Navigation
├── services/           # Lógica de datos y consultas con TanStack Query
├── types/              # Tipos de datos
├── utils/              # Carpeta con funciones generales para toda la app
├── schemas/            # Validaciones de formularios con Zod
└── App.tsx             # Punto de entrada de la app


