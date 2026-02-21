import Project from "../models/Project.js";
import Todo from "../models/Todo.js";
import { saveData, loadData } from "../storage/storage.js";

class TodoService {
    constructor() {
        this.projects = loadData() || [];

        // Ensure at least one project exists
        if (this.projects.length === 0) {
            const defaultProject = new Project("Default");

            defaultProject.addTodo(
                new Todo(
                    "Build To-Do App",
                    "Finish UI and interactions",
                    "2026-02-20",
                    "High",
                    "This is your default task",
                    [{ text: "Add form", done: false }]
                )
            );

            this.projects.push(defaultProject);
            this._commit();
        }
    }

    // ================================
    // Internal persistence helper
    // ================================
    _commit() {
        saveData(this.projects);
    }

    // ================================
    // Read Operations
    // ================================
    getProjects() {
        return this.projects;
    }

    getProjectById(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    getTodo(projectId, todoId) {
        const project = this.getProjectById(projectId);
        if (!project) return null;

        return project.todos.find(t => t.id === todoId);
    }

    // ================================
    // Project Operations
    // ================================
    createProject(name) {
        const newProject = new Project(name);
        this.projects.push(newProject);
        this._commit();
        return newProject;
    }

    // ================================
    // Todo Operations
    // ================================
    addTodoToProject(projectId, todoData) {
        const project = this.getProjectById(projectId);
        if (!project) return;

        const newTodo = new Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes || "",
            todoData.checklist || []
        );

        project.addTodo(newTodo);
        this._commit();
    }

    deleteTodoFromProject(projectId, todoId) {
        const project = this.getProjectById(projectId);
        if (!project) return;

        project.removeTodo(todoId);
        this._commit();
    }

    toggleTodo(projectId, todoId) {
        const todo = this.getTodo(projectId, todoId);
        if (!todo) return;

        todo.toggleComplete();
        this._commit();
    }

    toggleChecklistItem(projectId, todoId, index) {
        const project = this.getProjectById(projectId);
        if (!project) return;

        const todo = project.todos.find(t => t.id === todoId);
        if (!todo) return;

        todo.toggleChecklistItem(index);  // call Todo method

        saveData(this.projects);
    }
    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this._commit();
    }
}

export default new TodoService();
