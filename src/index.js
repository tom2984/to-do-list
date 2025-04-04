import "./styles.css";
import { Projects } from "./projects.js";
import { Todo } from "./todo.js";

// === Global Variables ===
let savedProjects = JSON.parse(localStorage.getItem('savedprojects')) || [];
let currentProjectId = "";
let currentTodoId = "";

let currentView = 'projects'; // or 'todos', 'todoDetail'

// === Utility Functions ===
function open(buttonId, dialogId) {
  const button = document.getElementById(buttonId);
  const dialog = document.getElementById(dialogId);

  if (button && dialog) {
    button.addEventListener('click', () => {
      dialog.showModal();
    });
  }
}

function clearContent(id) {
  document.getElementById(id).innerHTML = '';
}

// === Render Logic ===

function renderProjects() {
  clearContent('projectsContainer');
  const projectsContainer = document.getElementById('projectsContainer');

  savedProjects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.textContent = project.name;

    projectCard.addEventListener('click', () => {
      currentProjectId = project.id;
      document.getElementById('todoUI').style.display = 'block';
      document.getElementById('projectsUI').style.display = 'none';
      currentView = 'todos';
      renderTodos(currentProjectId);
    });

    projectsContainer.appendChild(projectCard);
  });
}

function renderTodos(projectId) {
  clearContent('todosContainer');
  const todosContainer = document.getElementById('todosContainer');
  const project = savedProjects.find(p => p.id === projectId);
  if (!project || !project.todos) return;

  project.todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-card');
    todoItem.textContent = todo.title;

    todoItem.addEventListener('click', () => {
      currentTodoId = todo.id;
      document.getElementById('todoDetailUI').style.display = 'block';
      document.getElementById('todoUI').style.display = 'none';
      currentView = 'todoDetail';
      renderToDosDetailed(currentTodoId);
    });

    todosContainer.appendChild(todoItem);
  });
}

function renderToDosDetailed(toDoID) {
  clearContent('todosDetailedContainer');
  const todosDetailed = document.getElementById('todosDetailedContainer');

  const project = savedProjects.find(p => p.id === currentProjectId);
  if (!project || !project.todos) return;

  const todo = project.todos.find(t => t.id === toDoID);
  if (!todo) return;

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = todo.title;

  const descriptionInput = document.createElement('textarea');
  descriptionInput.value = todo.description;

  const dueDateInput = document.createElement('input');
  dueDateInput.type = 'date';
  dueDateInput.value = todo.dueDate;

  const prioritySelect = document.createElement('select');
  ['low', 'medium', 'high'].forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    if (level === todo.priority) option.selected = true;
    prioritySelect.appendChild(option);
  });

  const notesInput = document.createElement('textarea');
  notesInput.value = todo.notes;

  const checklistInput = document.createElement('input');
  checklistInput.type = 'text';
  checklistInput.value = todo.checklist;

  const saveButton = document.createElement('button');
  saveButton.textContent = "Save Changes";
  saveButton.addEventListener('click', () => {
    // Save updated values back to the todo
    todo.title = titleInput.value;
    todo.description = descriptionInput.value;
    todo.dueDate = dueDateInput.value;
    todo.priority = prioritySelect.value;
    todo.notes = notesInput.value;
    todo.checklist = checklistInput.value;

    localStorage.setItem('savedprojects', JSON.stringify(savedProjects));
    alert("To-Do updated!");
  });

  todosDetailed.appendChild(titleInput);
  todosDetailed.appendChild(descriptionInput);
  todosDetailed.appendChild(dueDateInput);
  todosDetailed.appendChild(prioritySelect);
  todosDetailed.appendChild(notesInput);
  todosDetailed.appendChild(checklistInput);
  todosDetailed.appendChild(saveButton);
}

// === DOM-Ready Setup ===
document.addEventListener("DOMContentLoaded", () => {
  // Back Button Logic
  document.getElementById('backButton').addEventListener('click', () => {
    if (currentView === 'todos') {
      document.getElementById('todoUI').style.display = 'none';
      document.getElementById('projectsUI').style.display = 'block';
      currentView = 'projects';
    } else if (currentView === 'todoDetail') {
      document.getElementById('todoDetailUI').style.display = 'none';
      document.getElementById('todoUI').style.display = 'block';
      currentView = 'todos';
    }
  });

  // Cancel button logic (universal)
  document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', () => {
      const dialogId = button.getAttribute('data-dialog');
      const dialog = document.getElementById(dialogId);
      if (dialog) dialog.close();
    });
  });

  // Dialog Triggers
  open('createTask', 'taskDialog');
  open('createProject', 'projectDialog');

  // Submit project form
  const projectForm = document.getElementById('project-form');
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById("project-title").value;
    const newProject = new Projects(name);

    savedProjects.push(newProject);
    localStorage.setItem('savedprojects', JSON.stringify(savedProjects));
    renderProjects();

    projectForm.reset();
    document.getElementById('projectDialog').close();
  });

  // Submit todo form 
  const todoForm = document.getElementById('todo-form');
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;
    const notes = document.getElementById("notes").value;
    const checklist = document.getElementById("checklist").value;

    const newTodo = new Todo(name, description, dueDate, priority, notes, checklist);

    const currentProject = savedProjects.find(p => p.id === currentProjectId);
    if (!currentProject) {
      alert("No project selected");
      return;
    }

    currentProject.todos.push(newTodo);
    localStorage.setItem('savedprojects', JSON.stringify(savedProjects));
    renderTodos(currentProjectId);

    todoForm.reset();
    document.getElementById('taskDialog').close();
  });

  // Initial render
  renderProjects();
});
