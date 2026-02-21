# 🚀 TaskFlow – Vanilla JavaScript To-Do App

TaskFlow is a modular, state-driven To-Do application built using **Vanilla JavaScript**, structured with clean separation between Models, Services, Storage, and UI.

This project demonstrates how modern frontend architecture works **without using frameworks** like React or Vue, focusing on state management, DOM rendering, and localStorage persistence.

---

## ✨ Features

### 📁 Project Management
- Create new projects
- Delete projects
- Automatically select active project
- Default project created on first load

### ✅ Todo Management
- Add todos to projects
- Delete todos
- Mark todos as complete / undo
- Due date support
- Notes support
- Priority levels:
  - 🟢 Low
  - 🟡 Medium
  - 🔴 High

### ✔ Checklist Support
- Add checklist items (comma-separated input)
- Interactive checkboxes
- Strike-through completed items
- Persistent checklist state

### 🎨 UI
- Sidebar project layout
- Expand / collapse todo details
- Active project highlighting
- Smooth hover effects
- Clean modern gradient design

### 💾 Persistence
- Data stored in `localStorage`
- Automatic saving after every state change
- Rehydration of Project and Todo class instances after reload

---

## 🏗 Architecture

The application follows a layered structure:

```
UI (dom.js)
    ↓
Service Layer (todoService.js)
    ↓
Models (Project.js, Todo.js)
    ↓
Storage (storage.js → localStorage)
```




### 🔹 Model Layer

**Project.js**
- Stores project name and todos
- Methods:
  - `addTodo(todo)`
  - `removeTodo(todoId)`

**Todo.js**
- Stores todo details
- Methods:
  - `toggleComplete()`
  - `addNotes()`
  - `addChecklist()`
  - `toggleChecklistItem(index)`

---

### 🔹 Service Layer

**todoService.js**

Acts as the central state manager:
- Maintains project list
- Handles all CRUD operations
- Commits changes to storage
- Ensures default project exists

Key methods:
- `getProjects()`
- `getProjectById()`
- `createProject()`
- `deleteProject()`
- `addTodoToProject()`
- `deleteTodoFromProject()`
- `toggleTodo()`
- `toggleChecklistItem()`

---

### 🔹 Storage Layer

**storage.js**
- `saveData(projects)` → Saves to localStorage
- `loadData()` → Reconstructs Project & Todo instances

Important: Objects are rehydrated into proper class instances after loading.

---

### 🔹 UI Layer

**dom.js**
- Handles DOM rendering
- Manages UI state (active project)
- Attaches event listeners
- Triggers re-render after state changes

Rendering functions:
- `renderProjects()`
- `renderTodos(projectId)`

---

## 📂 Folder Structure


```
to-do/
├── dist/
│   ├── index.html
│   └── main.js
│
├── src/
│   ├── models/
│   │   ├── Project.js
│   │   └── Todo.js
│   │
│   ├── services/
│   │   └── todoService.js
│   │
│   ├── storage/
│   │   └── storage.js
│   │
│   ├── styles/
│   │   └── style.css
│   │
│   ├── ui/
│   │   └── dom.js
│   │
│   ├── index.js
│   └── template.html
│
├── webpack.config.js
├── package.json
└── README.md
```


---

## ⚙️ How It Works

1. App loads via `index.js`
2. `todoService` initializes and loads stored data
3. `renderProjects()` runs
4. First project auto-renders todos
5. User interactions call service methods
6. State updates
7. UI re-renders accordingly

State is treated as the **single source of truth**.

---

## 🧠 Concepts Practiced

- DOM manipulation
- Event delegation
- State management
- Separation of concerns
- LocalStorage persistence
- Class-based modeling
- Data rehydration
- UI vs Data state distinction
- Modular JavaScript (ES Modules)
- Webpack bundling

---

# 🛠 How To Run

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Bundle with Webpack:
```bash
npx webpack
```
4. Start the development server:
```bash
npm start
```
5. Open your browser and view the app.
