# React Todo List

A Todo List application built with React, focused on scalable architecture
and modern state management patterns.

## Demo
🔗 [Live Demo](https://illiashp.github.io/todo-react/)

![Preview](./preview.png)


## Tech Stack

- **React 19** — hooks, context, performance optimization
- **Vite** — build tool and dev server
- **SCSS Modules** — scoped component styles with CSS variables
- **json-server** — mock REST API for local development

## Features

- Add, complete, and delete tasks
- Real-time search with case-insensitive match highlighting
- CSS enter/exit animations on task add and delete
- Smooth scroll to the first incomplete task
- Form validation without external libraries
- Client-side routing with dynamic segments (`/tasks/:id`)
- Task detail page with async data fetching

## Technical Highlights

- **Feature-Sliced Design** — project structure follows FSD methodology
- **Custom router** — client-side routing via `history.pushState` and `popstate`,
  built without React Router or any routing library
- **Dual API layer** — `json-server` in development, `localStorage` in production.
  Switching is controlled via `VITE_STATIC_BACKEND` environment variable,
  all feature code stays unchanged
- **State management** — `useReducer` + `useContext` instead of Redux.
  Context value is memoized to prevent unnecessary re-renders
- **Performance** — `memo`, `useCallback`, and `useMemo` applied where
  re-renders would otherwise propagate through the list
- **XSS protection** — search highlight escapes HTML entities before
  injecting markup via `dangerouslySetInnerHTML`
- **Custom hooks** — `useTasks`, `useIncompleteTaskScroll`,
  `useCombinedRefs` to keep logic separate from UI

## Getting Started
```bash
git clone https://github.com/IlliaSHP/todo-react.git
cd todo-react
npm install
```

**Development mode** — with json-server REST API:
```bash
npm run server   # terminal 1: start mock API on port 3001
npm run dev      # terminal 2: start dev server
```

**Production mode** — with localStorage instead of json-server:
```bash
npm run build
npm run preview
```