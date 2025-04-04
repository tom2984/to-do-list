import "./styles.css";
import { Projects } from "./projects.js";
import { Todo } from "./todo.js";

// === Global Variables ===

let savedProjects = JSON.parse(localStorage.getItem('savedprojects')) || [];
let savedTodos = JSON.parse(localStorage.getItem('savedtodos')) || []; 
let currentProjectId = "";

let currentView = 'projects'; // or 'todos', 'todoDetail'

// === Utility Functions ===

function open(buttonId, dialogId) {
  const button = document.getElementById(buttonId);
  const dialog = document.getElementById(dialogId);

  if (button && dialog) {
    button.addEventListener('click', () => {
      dialog.showModal();
      console.log("Dialog opened:", dialogId);
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
      renderTodos(project.id);
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

    todosContainer.appendChild(todoItem);
  });
}

function renderToDosDetailed(toDoID) {
  clearContent('todosDetailedContainer');
}

// === DOM-Ready Setup ===

document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.getElementById('projectsContainer');
  const todosContainer = document.getElementById('todosContainer');

  // Back Button Logic
  document.getElementById('backButton').addEventListener('click', () => {
    if (currentView === 'todos') {
      document.getElementById('todoUI').style.display = 'none';
      document.getElementById('projectsUI').style.display = 'block';
      console.log("I am going back to projects");
      currentView = 'projects';
    } else if (currentView === 'todoDetail') {
      document.getElementById('todoDetailUI').style.display = 'none';
      document.getElementById('todoUI').style.display = 'block';
      console.log("I am going back to todos");
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
