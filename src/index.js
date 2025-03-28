import "./styles.css";
import { Projects } from "./projects.js";
import { Todo } from "./todo.js";

// === Global Variables ===

let savedProjects = JSON.parse(localStorage.getItem('savedprojects')) || [];
let currentProjectId = "";

const projectsContainer = document.getElementById('projectsContainer');
const todosContainer = document.getElementById('todosContainer');

// === Utility Functions ===

// Open dialog
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

// Clear content
function clearContent(id) {
  document.getElementById(id).innerHTML = '';
}

// Cancel button click (universal)
document.querySelectorAll('.cancel-btn').forEach(button => {
  button.addEventListener('click', () => {
    const dialogId = button.getAttribute('data-dialog');
    const dialog = document.getElementById(dialogId);
    if (dialog) dialog.close();
  });
});

// === Dialog Triggering ===

open('createTask', 'taskDialog');
open('createProject', 'projectDialog');

// === Form Submission ===

// Submit project form
const projectForm = document.getElementById('project-form');
projectForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById("project-title").value;
  const newProject = new Projects(name); // todos defaults to empty inside class

  savedProjects.push(newProject);
  localStorage.setItem('savedprojects', JSON.stringify(savedProjects));

  renderProjects(); // Refresh the UI
  projectForm.reset();
  document.getElementById('projectDialog').close();
});

// === Render Logic ===

function renderProjects() {
  clearContent('projectsContainer');

  savedProjects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.textContent = project.name;

    projectCard.addEventListener('click', () => {
      currentProjectId = project.id;
      renderTodos(project.id);
    });

    projectsContainer.appendChild(projectCard);
  });
}

function renderTodos(projectId) {
  clearContent('todosContainer');

  const project = savedProjects.find(p => p.id === projectId);
  if (!project || !project.todos) return;

  project.todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    todoItem.textContent = todo.title; // Adjust based on your Todo class

    todosContainer.appendChild(todoItem);
  });
}

// === Initial Load ===

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
});
