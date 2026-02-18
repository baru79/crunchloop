# Todo Lists UI

Este proyecto es el frontend para la aplicación de gestión de listas de tareas (Todo Lists). Está construido con React, TypeScript y Vite.

## Funcionalidades

- Creacion de listas
- Creacion de items dentro de una lista
- Edicion de listas
- Edicion de items dentro de una lista
- Eliminacion de listas
- Eliminacion de items dentro de una lista
- Reordenamiento de tareas mediante arrastrar y soltar (drag and drop)
- Cambio de tema oscuro/claro
- Filtros de items
- Diseño responsivo
- Persistencia del estado de la app atraves de localStorage
- Manejo de errores y notificaciones emergentes

## Instrucciones de Ejecución

### Ejecución Local

Para ejecutar el proyecto localmente, sigue estos pasos:

1.  Asegúrate de tener Node.js instalado.
2.  Ejecuta el proyecto de backend ubicado en la carpeta `backend`.
3.  Instala las dependencias:
    ```bash
    npm install
    ```
4.  Inicia el servidor de desarrollo:

    ```bash
    npm run dev
    ```

5.  Abre tu navegador en la URL que se muestra en la terminal (usualmente `http://localhost:5173`).

### Ejecución de Unit Tests

El proyecto utiliza Vitest para las pruebas unitarias. Para ejecutarlas:

```bash
npm run test
```

## Librerías Usadas

### @hello-pangea/dnd

Se utiliza para la funcionalidad de "Drag and Drop" (arrastrar y soltar) de los items en las listas.

**Razón de la elección:** Es un fork mantenido y accesible de `react-beautiful-dnd`. Proporciona una experiencia de usuario fluida y natural para reordenar listas, gestionando la complejidad de las interacciones de arrastre y las animaciones de forma eficiente en React, asegurando compatibilidad con versiones recientes de React (como React 18).

### tailwindcss

Se utiliza para el manejo de estilos de la aplicación.

**Razón de la elección:** Permite un desarrollo rápido de la interfaz de usuario mediante clases de utilidad. Facilita la creación de un diseño consistente y responsivo, y simplifica enormemente la implementación y mantenimiento del modo oscuro (Dark Mode) y temas personalizados sin la sobrecarga de archivos CSS tradicionales.

## Diseño de la App

Se tomó como referencia el siguiente Figma (https://www.figma.com/design/eLY9H4h1aKQrDZg7XmPIHE/To-do-list-project)

## Persistencia del Estado

El estado de la aplicación se mantiene en el `localStorage`, para de esta forma ante un refresco `localhost:5173` la app se mostrará correctamente con todas listas, items y modo claro/oscuro.

## Prompt Inicial

A continuación se detalla el prompt utilizado para la creación base del proyecto a través del agente de IA:

Preciso implementar la app TODO List en React y Typescript.

Para eso primero debes crear dentro de `/src`:

- una carpeta types, con los tipos extraidos desde el backend dentro de `/backend/src/todo-lists/entities`

- una variable de entorno `VITE_API_URL:http://localhost:4000/api`

- una carpeta services, con un archivo `todoService.ts` con los servicios del _CRUD_ para **TODO-LIST** y **TODO-ITEMS** (basandote en la carpeta de backend)

- una carpeta hooks, con un archivo `useTodoManager.ts` para el manejo de las operaciones _CRUD_, que usara desde `todoService.ts`

- una carpeta components con los siguientes componentes:
  - **CreateListForm.tsx** (para la creacion de listas)

  - **ListView.tsx** (para visualizar la Lista, que contendra el nombre de la lista y los items, ademas de un form para poder agregar items. En la parte superior del lado izquierdo estara el nombre de la lista, y del lado derecho un badge con la cantidad de items y sobre la esquina superior un icon `CloseIcon.tsx` para poder eliminar la lista)

  - **ItemRow.tsx** (para visualizar el item, que tendra un checkbox a la izquierda, luego el nombre del item y debajo la descripcion. A la derecha debe haber un icono DeleteIcon para poder eliminar el item)

  - **AddItemRow.tsx** (es un formulario que contiene un input y un boton con un icono PlusIcon. Dentro del input se podra tipear un item y sera agregado con el boton PlusIcon ubicado a la derecha del input)

- Dentro de la carpeta components se debe crear una carpeta icons con los siguientes icons en svg:
  - **CloseIcon.tsx** (usado en ListView para eliminar la lista)

  - **DeleteIcon.tsx** (usado en cada ItemRow para eliminar el item)

  - **PlusIcon.tsx** (usado en el boton de AddItemForm para agregar un item)

  - **SpinerIcon.tsx** (usado para el estado de loading inicial cuando se cargan las listas)
