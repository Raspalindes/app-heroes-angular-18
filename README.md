# Aplicación CRUD de Héroes con Angular

Este proyecto es un ejercicio práctico para construir una aplicación web CRUD (Crear, Leer, Actualizar, Eliminar) utilizando Angular. La aplicación gestionará una lista de héroes obtenida desde un `json-server` local.

## 1. Primeros Pasos

Sigue estas instrucciones para poner en marcha el proyecto en tu máquina local.

### Prerrequisitos

Asegúrate de tener [Node.js](https://nodejs.org/) instalado (que incluye npm).

### Instalación

1.  Clona o descarga este repositorio en tu máquina.
2.  Abre una terminal en la raíz del proyecto.
3.  Instala todas las dependencias del proyecto ejecutando:

    ```bash
    npm install
    ```

### Arranque del Proyecto

Para arrancar la aplicación, simplemente ejecuta el siguiente comando. Esto iniciará simultáneamente el servidor de desarrollo de Angular y el `json-server` que actúa como nuestro backend falso.

```bash
npm start
```

- El frontend de Angular estará disponible en `http://localhost:4200/`.
- La API de héroes estará disponible en `http://localhost:3000/heroes`.

---

## 2. Lista de Tareas para el Alumno

El objetivo es construir la aplicación paso a paso. Completa las tareas en el orden sugerido para tener una curva de aprendizaje progresiva y coherente.

### Fase 1: Preparación y Visualización de Héroes (Read)

En esta fase, nos centraremos en configurar lo básico y mostrar la lista completa de héroes.

- [ ] **Tarea 1: Crear el Modelo de Datos (`Hero`)**
  - Crea una interfaz en `src/app/core/interfaces/hero.interface.ts` que defina la estructura de un objeto Héroe según los datos de `data/db.json` (`id`, `superhero`, `publisher`, etc.).

- [ ] **Tarea 2: Crear el Servicio de Héroes (`HeroesService`)**
  - Genera un nuevo servicio en `src/app/core/services/heroes.service.ts`.
  - Inyéctale el `HttpClient` para poder hacer peticiones HTTP.
  - Crea un método `getHeroes()` que realice una petición `GET` a `http://localhost:3000/heroes` y devuelva un `Observable<Hero[]>`.

- [ ] **Tarea 3: Crear el Componente para la Lista de Héroes**
  - Crea un nuevo componente, por ejemplo, `HeroesListComponent`.
  - Inyecta tu `HeroesService`.
  - En el `ngOnInit`, llama al método `getHeroes()` del servicio y almacena la lista de héroes en una propiedad del componente.
  - En la plantilla HTML, utiliza la nueva sintaxis de control de flujo `@for` para iterar sobre la lista de héroes y mostrarlos. Asegúrate de incluir la propiedad `track` para un rendimiento óptimo (ej: `@for (hero of heroes(); track hero.id)`) . Puedes empezar mostrando solo el `superhero` y el `publisher`.
  - Añade este componente a una ruta principal (por ejemplo, `/heroes/list`) en tu archivo de rutas.

### Fase 2: Vista de Detalle (Read)

Ahora, vamos a permitir que el usuario vea los detalles de un solo héroe.

- [ ] **Tarea 1: Ampliar el Servicio**
  - Añade un método `getHeroById(id: string)` al `HeroesService`.
  - Este método debe hacer una petición `GET` a `http://localhost:3000/heroes/{id}` para obtener un solo héroe.

- [ ] **Tarea 2: Crear el Componente de Detalle**
  - Crea un nuevo componente, por ejemplo, `HeroDetailComponent`.
  - Este componente necesita leer el `id` del héroe desde los parámetros de la ruta (pista: `ActivatedRoute`).
  - Usa el `id` para llamar al nuevo método `getHeroById(id)` de tu servicio.
  - Muestra toda la información del héroe en la plantilla.

- [ ] **Tarea 3: Configurar la Navegación**
  - En `HeroesListComponent`, convierte el nombre de cada héroe en un enlace.
  - Este enlace debe navegar a la ruta de detalle, pasando el `id` del héroe. Ejemplo: `/heroes/detail/{{hero.id}}`.
  - Asegúrate de tener configurada la ruta de detalle en tu archivo de rutas (por ejemplo, `/heroes/detail/:id`).

### Fase 3: Creación de Héroes (Create)

Vamos a añadir la funcionalidad para crear nuevos héroes.

- [ ] **Tarea 1: Formulario de Creación**
  - Crea un componente `HeroFormComponent` que contenga un formulario para dar de alta un nuevo héroe. Puedes usar `ReactiveFormsModule`.
  - El formulario debe tener campos para las propiedades más importantes (`superhero`, `publisher`, `alter_ego`, etc.).

- [ ] **Tarea 2: Método `create` en el Servicio**
  - Añade un método `createHero(hero: Hero)` a `HeroesService` que realice una petición `POST` al endpoint `/heroes`.

- [ ] **Tarea 3: Guardar el Héroe**
  - En `HeroFormComponent`, implementa la lógica para que, al enviar el formulario, se llame al método `createHero()` del servicio.
  - Tras crear el héroe con éxito, redirige al usuario a la lista de héroes para que pueda ver el nuevo héroe añadido.

### Fase 4: Actualización de Héroes (Update)

Permitiremos que un héroe existente sea editado.

- [ ] **Tarea 1: Reutilizar el Formulario**
  - Puedes reutilizar `HeroFormComponent` para la edición.
  - Cuando se navegue a la ruta de edición (ej: `/heroes/edit/:id`), el formulario debe cargarse con los datos del héroe correspondiente. Usa el `id` de la ruta para obtener los datos con `getHeroById()`.

- [ ] **Tarea 2: Método `update` en el Servicio**
  - Añade un método `updateHero(hero: Hero)` en `HeroesService` que realice una petición `PUT` o `PATCH` a `/heroes/{{hero.id}}`.

- [ ] **Tarea 3: Guardar Cambios y Navegar**
  - Añade un botón "Editar" en la vista de lista o de detalle que navegue a la ruta de edición.
  - Implementa la lógica de guardado en `HeroFormComponent` para que llame a `updateHero()`.
  - Tras guardar, redirige al usuario a la lista o a la vista de detalle.

### Fase 5: Eliminación de Héroes (Delete)

La última operación del CRUD.

- [ ] **Tarea 1: Método `delete` en el Servicio**
  - Crea un método `deleteHero(id: string)` en `HeroesService` que realice una petición `DELETE` a `/heroes/{id}`.

- [ ] **Tarea 2: Botón de Eliminar**
  - Añade un botón "Eliminar" en la `HeroesListComponent` para cada héroe.
  - Al hacer clic, llama al método `deleteHero()` del servicio.
  - (Opcional pero recomendado) Pide confirmación al usuario antes de borrar (`confirm()`).

- [ ] **Tarea 3: Actualizar la Vista**
  - Después de eliminar un héroe, asegúrate de que la lista en la `HeroesListComponent` se actualice para no mostrar el héroe eliminado.

### Fase 6 (Opcional): Mejoras y Desafíos Adicionales

Si has completado todo lo anterior, aquí tienes algunas ideas para mejorar la aplicación:

- [ ] **Buscador de Héroes**: Añade un campo de búsqueda en `HeroesListComponent` que filtre los héroes en tiempo real a medida que el usuario escribe.
- [ ] **Mejorar la UI/UX**:
  - Utiliza una librería de componentes como **Angular Material** para que la aplicación tenga un aspecto más profesional.
  - Usa la sintaxis `@if` y `@defer` para mostrar un _spinner_ de carga mientras se obtienen los datos y para gestionar los estados de error.
  - Gestiona y muestra al usuario los posibles errores de las peticiones HTTP de forma clara.
- [ ] **Assets de Imágenes**: Crea una forma de mostrar las imágenes de los héroes (la propiedad `img` en los datos parece ser una clave para una imagen).
- [ ] **Validaciones del Formulario**: Añade validaciones a los campos del formulario (campos requeridos, longitud mínima, etc.) y muestra mensajes de error útiles.
