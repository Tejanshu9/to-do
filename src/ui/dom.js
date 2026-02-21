import todoService from "../services/todoService.js";

let activeProjectId = null;

/* ============================
   RENDER PROJECTS
============================ */

export function renderProjects() {
    const container = document.getElementById("projects");
    container.innerHTML = "";

    const header = document.createElement("h2");
    header.textContent = "📁 Projects";

    const addProjectBtn = document.createElement("button");
    addProjectBtn.textContent = "➕ Add Project";
    addProjectBtn.classList.add("add-project-btn");

    addProjectBtn.addEventListener("click", () => {
        const name = prompt("Enter project name:");
        if (!name) return;

        const newProject = todoService.createProject(name);
        activeProjectId = newProject.id;

        renderProjects();
        renderTodos(newProject.id);
    });

    container.append(header, addProjectBtn);

    todoService.getProjects().forEach(project => {

        const div = document.createElement("div");
        div.classList.add("project-item");

        if (project.id === activeProjectId) {
            div.classList.add("active-project");
        }

        const nameSpan = document.createElement("span");
        nameSpan.textContent = project.name;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.classList.add("delete-project-btn");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            todoService.deleteProject(project.id);

            const projects = todoService.getProjects();

            if (projects.length > 0) {
                activeProjectId = projects[0].id;
                renderProjects();
                renderTodos(projects[0].id);
            } else {
                activeProjectId = null;
                renderProjects();
                document.getElementById("todo-content").innerHTML = "";
            }
        });

        div.addEventListener("click", () => {
            activeProjectId = project.id;
            renderProjects();
            renderTodos(project.id);
        });

        div.append(nameSpan, deleteBtn);
        container.appendChild(div);
    });
}

/* ============================
   RENDER TODOS
============================ */

export function renderTodos(projectId) {
    activeProjectId = projectId;

    const todoContainer = document.getElementById("todo-content");
    todoContainer.innerHTML = "";

    const project = todoService.getProjectById(projectId);
    if (!project) return;

    /* ===== Add Todo Button ===== */

    const addBtn = document.createElement("button");
    addBtn.textContent = "➕ Add Todo";
    addBtn.classList.add("add-btn");

    const form = document.createElement("form");
    form.classList.add("todo-form", "hidden");

    form.innerHTML = `
        <input type="text" name="title" placeholder="Title" required />
        <textarea name="description" placeholder="Description"></textarea>
        <input type="date" name="dueDate" required />
        <select name="priority">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </select>
        <textarea name="notes" placeholder="Notes"></textarea>
        <input type="text" name="checklist" placeholder="Checklist (comma separated)" />
        <button type="submit">Save</button>
    `;

    addBtn.addEventListener("click", () => {
        form.classList.toggle("hidden");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = new FormData(form);

        const checklistInput = data.get("checklist");
        const checklist = checklistInput
            ? checklistInput.split(",").map(item => ({
                text: item.trim(),
                done: false
            }))
            : [];

        todoService.addTodoToProject(projectId, {
            title: data.get("title"),
            description: data.get("description"),
            dueDate: data.get("dueDate"),
            priority: data.get("priority"),
            notes: data.get("notes"),
            checklist: checklist
        });

        form.reset();
        form.classList.add("hidden");

        renderTodos(projectId);
        renderProjects();
    });

    todoContainer.append(addBtn, form);

    /* ===== Render Todo Cards ===== */

    project.todos.forEach(todo => {
        const todoCard = document.createElement("div");
        todoCard.classList.add("todo");

        if (todo.completed) {
            todoCard.classList.add("completed-task");
        }

        /* --- Title --- */
        const titleDiv = document.createElement("div");
        titleDiv.classList.add("title");
        titleDiv.textContent = todo.title;

        titleDiv.addEventListener("click", () => {
            detailsDiv.classList.toggle("hidden");
        });

        /* --- Due Date --- */
        const dueDateDiv = document.createElement("div");
        dueDateDiv.classList.add("duedate");
        dueDateDiv.textContent = todo.dueDate;

        /* --- Priority (Color via CSS class) --- */
        const priorityDiv = document.createElement("div");
        priorityDiv.classList.add("priority");
        priorityDiv.textContent = `Priority: ${todo.priority}`;
        priorityDiv.classList.add(`priority-${todo.priority.toLowerCase()}`);

        /* --- Complete Button --- */
        const completedBtn = document.createElement("button");
        completedBtn.textContent = todo.completed ? "Undo" : "Complete";

        completedBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            todoService.toggleTodo(projectId, todo.id);
            renderTodos(projectId);
        });

        /* --- Delete Button --- */
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            todoService.deleteTodoFromProject(projectId, todo.id);
            renderTodos(projectId);
            renderProjects();
        });

        /* ===== Details Section ===== */

        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("details", "hidden");

        const descriptionDiv = document.createElement("div");
        descriptionDiv.textContent = todo.description;

        const notesDiv = document.createElement("div");
        notesDiv.textContent = todo.notes;

        detailsDiv.append(descriptionDiv, notesDiv);

        /* ===== Checklist with Real Checkboxes ===== */

        if (todo.checklist && todo.checklist.length > 0) {
            const checklistContainer = document.createElement("div");
            checklistContainer.classList.add("checklist-container");

            todo.checklist.forEach((item, index) => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("checklist-item");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = item.done;

                checkbox.addEventListener("click", (e) => {
                    e.stopPropagation();
                    todoService.toggleChecklistItem(
                        projectId,
                        todo.id,
                        index
                    );
                    renderTodos(projectId);
                });

                const label = document.createElement("span");
                label.textContent = item.text;

                if (item.done) {
                    label.classList.add("checklist-done");
                }

                itemDiv.append(checkbox, label);
                checklistContainer.appendChild(itemDiv);
            });

            detailsDiv.appendChild(checklistContainer);
        }

        /* Toggle details */


        todoCard.append(
            titleDiv,
            dueDateDiv,
            priorityDiv,
            completedBtn,
            deleteBtn,
            detailsDiv
        );

        todoContainer.appendChild(todoCard);
    });
}