# Todo Lists UI

This project is the frontend for the task management application (Todo Lists). It is built with **React**, **TypeScript**, and **Vite**.

## Features

- List creation
- Item creation within a list
- List editing
- Item editing within a list
- List deletion
- Item deletion within a list
- Task reordering via **Drag and Drop**
- Dark/Light theme toggle
- Item filters
- Responsive design
- App state persistence through `localStorage`
- Robust error handling
- Global notification system
- **Optimistic UI updates** (updates UI state before the server promise resolves)
- Unit testing with **Vitest**
- Integration testing with **Playwright**

## Execution Instructions

### Local Execution

To run the project locally, follow these steps:

1.  Ensure you have **Node.js** installed.
2.  Run the backend project located in the `backend` folder.
3.  Install dependencies:
    ```bash
    # Install dependencies
    npm install
    ```
4.  Start the development server:
    ```bash
    # Run development server
    npm run dev
    ```
5.  Open your browser at the URL shown in the terminal (usually `http://localhost:5173`).

### Running Unit Tests

The project uses **Vitest** for unit testing. To run them:

```bash
# Run unit tests - Headless mode (CLI)
npm run test
```

```bash
# Run unit tests - Interactive mode (UI)
npm run test:ui
```

### Running Integration Tests (E2E)

The project uses **Playwright** for full-flow testing. To run them:

```bash
# Run integration tests - Headless mode (CLI)
npm run test:e2e
```

```bash
# Run integration tests - Interactive mode (UI)
npm run test:e2e:ui
```

## Libraries Used

### @hello-pangea/dnd

Used for the "Drag and Drop" functionality of items within lists.

**Reason for choice:** It is a maintained and accessible fork of `react-beautiful-dnd`. It provides a smooth and natural user experience for reordering lists, managing the complexity of drag interactions and animations efficiently in React, ensuring compatibility with modern versions (React 18+).

### TailwindCSS

Used for the application's styling management.

**Reason for choice:** It allows for rapid UI development through utility classes. It facilitates the creation of a consistent and responsive design, and greatly simplifies the implementation and maintenance of Dark Mode and custom themes without the overhead of traditional CSS files.

### Sonner

Used for the global notification system and real-time feedback.

**Reason for choice:** A lightweight notification library with a minimalist design that integrates perfectly with React. It was chosen over a custom implementation because it natively manages message stacking, exit animations, and touch gestures, ensuring users receive immediate feedback (such as API errors or save confirmations) in a fluid, non-intrusive way.

### Vitest & React Testing Library

Used as the primary ecosystem for quality assurance and application testing.

**Reason for choice:**

- **Vitest:** Being native to Vite, it offers exceptional speed and seamless integration with the project's configuration, allowing it to use the same TypeScript transformations as in development.

- **React Testing Library:** Allows validating the interface from the user's perspective. It facilitates accessibility testing and ensures components react correctly to real events, avoiding fragile tests that depend on internal code details.

### Playwright

Used for integration and end-to-end (E2E) testing in real browsers.

**Reason for choice:** It provides a robust and modern testing environment that validates application behavior exactly as an end-user would experience it. It was chosen for its ability to run tests across multiple rendering engines (`Chromium`, `Firefox`) natively, its excellent auto-waiting capabilities, and full state isolation. It is essential for ensuring that communication with the real API, `localStorage` persistence, and complex state synchronization (such as **Dark Mode** or list ordering) work correctly in a production-like environment.

## Error Handling

The application implements a centralized and predictable error-handling strategy, both in the service layer and the UI.

**Implemented Strategy:**

- **Service Standardization:** A handleResponseError helper function is used in API services to capture non-successful responses. This ensures all thrown errors contain the HTTP status code and server message (e.g., `404 Not Found`), facilitating issue tracking.

- **UI Layer Validation:** Hooks responsible for **CRUD** operations manage exceptions to prevent unexpected app crashes, allowing the interface to react appropriately to network failures or backend validation errors.

- **User Feedback:** Clear loading states and messages have been designed to inform the user when an operation (creation, editing, or deletion) could not be completed successfully.

## App Design

The design was based on the following **Figma** reference: (https://www.figma.com/design/eLY9H4h1aKQrDZg7XmPIHE/To-do-list-project)

## State Persistence

The application state is maintained in `localStorage`. This ensures that upon refreshing `localhost:5173`, the app correctly displays all lists, items, and the selected **light/dark** mode.

## AI - Initial Prompt

Below is the prompt used for the base creation of the project through an AI agent:

I need to implement a TODO List app in React and TypeScript.

For that, you must first create within `/src`:

- A types folder, with types extracted from the backend inside `/backend/src/todo-lists/entities`

- An environment variable VITE_API_URL:http://localhost:4000/api

- A services folder, with a `todoService.ts` file containing **CRUD** services for **TODO-LIST** and **TODO-ITEMS** (based on the backend folder)

- A hooks folder, with a `useTodoManager.ts` file for handling **CRUD** operations, utilizing todoService.ts

- A components folder with the following components:
  - **CreateListForm.tsx** (for list creation)

  - **ListView.tsx** (to visualize the List, containing the list name and items, plus a form to add items. The list name should be on the top-left, and a `CloseIcon.tsx` on the top-right corner to delete the list)

  - **ItemRow.tsx** (to visualize the item, with a checkbox on the left, followed by the item name and description. A `CloseIcon.tsx` should be on the right to delete the item)

  - **AddItemRow.tsx** (a form containing an input and a button with a `PlusIcon.tsx`. Typing in the input and clicking the button adds the item)

Inside the `components` folder, create an `icons` folder with the following SVG icons:

- **CloseIcon.tsx** (used in `ListView.tsx` for remove the list)

- **DeleteIcon.tsx** (used in each `ItemRow.tsx` for remove the item)

- **PlusIcon.tsx** (used in the button of `AddItemForm.tsx` for add a new item)

- **SpinerIcon.tsx** (used for the loading state of the app when the lists are being loaded)

## Refactoring and Testing

Although the base was generated via AI, the project underwent a refactoring process to ensure **strict typing** (eliminating the use of any), the implementation of design patterns like **Optimistic UI with Rollback**, and full service coverage through unit tests in **Vitest**.
