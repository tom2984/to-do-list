import "./styles.css";
import { Projects } from "./projects.js";
import { Todo } from "./todo.js";

// === Global Variables ===

let savedProjects = JSON.parse(localStorage.getItem('savedprojects')) || [];
let savedTodos = JSON.parse(localStorage.getItem('savedtodos')) || []; 
let currentProjectId = "";

const projectsContainer = document.getElementById('projectsContainer');
const todosContainer = document.getElementById('todosContainer');

let currentView = 'projects'; // or 'todos', 'todoDetail'


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

// Back button

document.getElementById('backButton').addEventListener('click', () => {
  if (currentView === 'todos') {
    // Go back to projects
    document.getElementById('todoUI').style.display = 'none';
    document.getElementById('projectUI').style.display = 'block';
    document.getElementById('backButton').style.display = 'none';

    currentView = 'projects';
  } else if (currentView === 'todoDetail') {
    // Go back to todo list (if you add a detailed view later)
    document.getElementById('todoDetailUI').style.display = 'none';
    document.getElementById('todoUI').style.display = 'block';

    currentView = 'todos';
  }
});


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

  const newTodo = new Todo(name,description, dueDate, priority, notes, checklist);

  // ✅ Find the project currently selected
  const currentProject = savedProjects.find(p => p.id === currentProjectId);

  if (!currentProject) {
    alert("No project selected");
    return;
  }

  // ✅ Push to that project’s todo array
  currentProject.todos.push(newTodo);

  // ✅ Save updated projects array
  localStorage.setItem('savedprojects', JSON.stringify(savedProjects));

  // ✅ Refresh UI
  renderTodos(currentProjectId);

  // Optional: Reset form & close dialog
  todoForm.reset();
  document.getElementById('taskDialog').close();
});

// === Render Logic ===

// Render Projects

function renderProjects() {
  clearContent('projectsContainer');

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

// Render Todos

function renderTodos(projectId) {
  clearContent('todosContainer');

  const project = savedProjects.find(p => p.id === projectId);
  if (!project || !project.todos) return;

  project.todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-card');
    todoItem.textContent = todo.title; // Adjust based on your Todo class

    todosContainer.appendChild(todoItem);
  });
}

// Render Todos Detailed

function renderToDosDetailed(toDoID) {
  clearContent('')
}



// === Initial Load ===

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
});
