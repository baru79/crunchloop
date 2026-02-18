# Todo Lists UI

Este proyecto es el frontend para la aplicación de gestión de listas de tareas (Todo Lists). Está construido con React, TypeScript y Vite.

## Funcionalidades

- Creación de listas
- Creación de ítems dentro de una lista
- Edición de listas
- Edición de ítems dentro de una lista
- Eliminación de listas
- Eliminación de ítems dentro de una lista
- Reordenamiento de tareas mediante arrastrar y soltar (drag and drop)
- Cambio de tema oscuro/claro
- Filtros de ítems
- Diseño responsivo
- Persistencia del estado de la app a través de localStorage
- Manejo de errores robusto
- Manejo de notificaciones
- Actualizaciones de UI optimistas (actualiza el estado antes de que termine la promesa)
- Tests unitarios con Vitest
- Tests integrales con Playwright

## Instrucciones de Ejecución

### Ejecución Local

Para ejecutar el proyecto localmente, sigue estos pasos:

1.  Asegúrate de tener Node.js instalado.
2.  Ejecuta el proyecto de backend ubicado en la carpeta `backend`.
3.  Instala las dependencias:
    ```bash
    # Instalar las dependencias
    npm install
    ```
4.  Inicia el servidor de desarrollo:

    ```bash
    # Ejecutar el servidor de desarrollo
    npm run dev
    ```

5.  Abre tu navegador en la URL que se muestra en la terminal (usualmente `http://localhost:5173`).

### Ejecución de Unit Tests

El proyecto utiliza Vitest para las pruebas unitarias. Para ejecutarlas:

```bash
# Ejecutar los tests unitarios - Modo headless (CLI)
npm run test
```

```bash
# Ejecutar los tests unitarios - Modo interactivo (UI)
npm run test:ui
```

### Ejecución de Tests de Integración (E2E)

El proyecto utiliza **Playwright** para pruebas de flujo completo. Para ejecutarlas:

```bash
# Ejecutar los tests de integración - Modo headless (CLI)
npm run test:e2e
```

```bash
# Ejecutar los tests de integración - Modo interactivo (UI)
npm run test:e2e:ui
```

## Librerías Usadas

### @hello-pangea/dnd

Se utiliza para la funcionalidad de "Drag and Drop" (arrastrar y soltar) de los ítems en las listas.

**Razón de la elección:** Es un fork mantenido y accesible de `react-beautiful-dnd`. Proporciona una experiencia de usuario fluida y natural para reordenar listas, gestionando la complejidad de las interacciones de arrastre y las animaciones de forma eficiente en React, asegurando compatibilidad con versiones recientes de React (como React 18).

### TailwindCSS

Se utiliza para el manejo de estilos de la aplicación.

**Razón de la elección:** Permite un desarrollo rápido de la interfaz de usuario mediante clases de utilidad. Facilita la creación de un diseño consistente y responsivo, y simplifica enormemente la implementación y mantenimiento del modo oscuro (Dark Mode) y temas personalizados sin la sobrecarga de archivos CSS tradicionales.

### Sonner

Se utiliza para el sistema de notificaciones globales y feedback en tiempo real.

**Razón de la elección:** Es una librería de notificaciones extremadamente ligera y con un diseño minimalista que se integra perfectamente con React. Se eligió sobre una implementación propia porque gestiona de forma nativa la pila de mensajes (stacking), las animaciones de salida y los gestos táctiles, garantizando que el usuario reciba feedback inmediato de sus acciones (como errores de API o confirmaciones de guardado) de manera fluida y no intrusiva.

### Vitest & React Testing Library

Se utilizan como el ecosistema principal para la garantía de calidad y pruebas de la aplicación.

**Razón de la elección:**

- **Vitest:** Al ser nativo de Vite, ofrece una velocidad excepcional y una integración perfecta con la configuración del proyecto, permitiendo usar las mismas transformaciones de TypeScript que en desarrollo.

- **React Testing Library:** Permite validar la interfaz desde la perspectiva del usuario. Facilita las pruebas de accesibilidad y asegura que los componentes reaccionen correctamente a eventos reales, evitando tests frágiles que dependen de los detalles internos del código.

## Manejo de Errores

La aplicación implementa una estrategia de manejo de errores centralizada y predecible, tanto en la capa de servicios como en la interfaz.

**Estrategia implementada:**

- **Estandarización en Servicios:** Se utiliza una función auxiliar `handleResponseError` en los servicios de API para capturar respuestas no exitosas. Esto asegura que todos los errores lanzados contengan el código de estado HTTP y el mensaje del servidor (ej. `404 Not Found`), facilitando el rastreo de problemas.

- **Validación en Capa de UI:** Los hooks encargados de las operaciones CRUD gestionan excepciones para evitar cierres inesperados de la aplicación, permitiendo que la interfaz reaccione adecuadamente ante fallos de red o errores de validación del backend.

- **Feedback al Usuario:** Se han diseñado estados de carga y mensajes claros para informar al usuario cuando una operación (creación, edición o borrado) no ha podido completarse con éxito.

## Diseño de la App

Se tomó como referencia el siguiente Figma (https://www.figma.com/design/eLY9H4h1aKQrDZg7XmPIHE/To-do-list-project)

## Persistencia del Estado

El estado de la aplicación se mantiene en el `localStorage`, para de esta forma ante un refresco `localhost:5173` la app se mostrará correctamente con todas listas, items y modo claro/oscuro.

## IA - Prompt Inicial

A continuación se detalla el prompt utilizado para la creación base del proyecto a través del agente de IA:

Preciso implementar la app TODO List en React y TypeScript.

Para eso primero debes crear dentro de `/src`:

- una carpeta types, con los tipos extraídos desde el backend dentro de `/backend/src/todo-lists/entities`

- una variable de entorno `VITE_API_URL:http://localhost:4000/api`

- una carpeta services, con un archivo todoService.ts con los servicios del CRUD para **TODO-LIST** y **TODO-ITEMS** (basándote en la carpeta de backend)

- una carpeta hooks, con un archivo `useTodoManager.ts` para el manejo de las operaciones CRUD, que usará desde `todoService.ts`

- una carpeta components con los siguientes componentes:
  - **CreateListForm.tsx** (para la creación de listas)

  - **ListView.tsx** (para visualizar la Lista, que contendra el nombre de la lista y los items, ademas de un form para poder agregar items. En la parte superior del lado izquierdo estara el nombre de la lista, y del lado derecho sobre la esquina superior un icono `CloseIcon.tsx` para poder eliminar la lista)

  - **ItemRow.tsx** (para visualizar el ítem, que tendrá un checkbox a la izquierda, luego el nombre del ítem y debajo la descripción. A la derecha debe haber un icono `CloseIcon.tsx` para poder eliminar el ítem)

  - **AddItemRow.tsx** (es un formulario que contiene un input y un botón con un icono `PlusIcon.tsx`. Dentro del input se podrá tipear un ítem y será agregado con el botón PlusIcon ubicado a la derecha del input)

- Dentro de la carpeta components se debe crear una carpeta icons con los siguientes iconos en svg:
  - **CloseIcon.tsx** (usado en `ListView.tsx` para eliminar la lista)

  - **DeleteIcon.tsx** (usado en cada `ItemRow.tsx` para eliminar el item)

  - **PlusIcon.tsx** (usado en el botón de `AddItemForm.tsx` para agregar un item)

  - **SpinerIcon.tsx** (usado para el estado de loading inicial cuando se cargan las listas)

## Refactorizacion y Testing

Aunque la base fue generada mediante IA, el proyecto pasó por un proceso de refactorización para asegurar el tipado estricto (eliminando el uso de any), la implementación de patrones de diseño como Optimistic UI con Rollback y la cobertura total de servicios mediante pruebas unitarias en Vitest.
