import todoService from "./services/todoService.js";
import { renderProjects, renderTodos } from "./ui/dom.js";
import "./styles/style.css";


renderProjects();

const firstProject = todoService.getProjects()[0];
if (firstProject) {
    renderTodos(firstProject.id);
}
