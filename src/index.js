import "./styles.css";
import{ Projects } from "./projects.js";
import{ Todo } from "./todo.js"; 

//Eventlisteners and actions: 

//Button click and dialog opened

function open(buttonId, dialogId) {
    const button = document.getElementById(buttonId);
    const dialog = document.getElementById(dialogId);
  
    if (button && dialog) {
      button.addEventListener('click', () => {
        dialog.showModal();
        console.log("I have been chosen");
      });
}
}

open('createTask', 'taskDialog');
open('createProject', 'projectDialog');

//Clearing content

function clearContent(id) {
    document.getElementById('id').innerHTML = '';
}

//Cancel button clicked

document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', () => {
      const dialogId = button.getAttribute('data-dialog');
      const dialog = document.getElementById(dialogId);
      if (dialog) dialog.close();
    });
  });

//Project Data submission

const savedProjects = JSON.parse(localStorage.getItem('savedprojects')) || [];

const submit = document.getElementById('submit-task');
submit.addEventListener('submit', () => { 
const newProject = new Projects(document.getElementById("project-title"))
savedProjects.push(newProject);
localStorage.setItem('savedprojects', JSON.stringify(savedProjects));
})

//Active project

currentProjectId = ""

//Task Data submission 

function tasksToProjects() {
    for(project in savedProjects)    
}

//Render projects on pageload 

const projectsContainer = document.getElementById('projectsContainer');

document.addEventListener("DOMContentLoaded", () => {
  savedProjects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.textContent = project.name;

    // When a project is clicked...
    projectCard.addEventListener('click', () => {
      currentProjectId = project.id;
      renderTodos(projectId); // Or: renderTodos(project.id)
    });

    projectsContainer.appendChild(projectCard);
  });
});


//Render todos 

function renderTodos(projectId) {

}