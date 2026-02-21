import Project from "../models/Project";
import Todo from "../models/Todo.js";

export function saveData(projects) {
    localStorage.setItem("todoApp", JSON.stringify(projects));
}

export function loadData() {
    const data = localStorage.getItem("todoApp");
    if (!data) return null;

    const parsed = JSON.parse(data);

    return parsed.map(project => {
        const newProject = new Project(project.name);
        newProject.id = project.id;

        project.todos.forEach(todo => {
            const newTodo = new Todo(
                todo.title,
                todo.description,
                todo.dueDate,
                todo.priority,
                todo.notes,
                todo.checklist
            );
            newTodo.id = todo.id;
            newTodo.completed = todo.completed;

            newProject.addTodo(newTodo);
        });

        return newProject;
    });
}
