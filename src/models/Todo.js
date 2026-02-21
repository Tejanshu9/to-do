export default class Todo {
    constructor(title, description, dueDate, priority, notes, checklist) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.notes = notes || "";
        this.checklist = checklist || [];
    }

    toggleComplete() {
    this.completed = !this.completed;
    }

    addNotes(text) {
      this.notes = text;
    }

    addChecklist(text) {
      this.checklist.push({text, done: false});
    }

    toggleChecklistItem(index) {
      this.checklist[index].done = !this.checklist[index].done;
    }
}