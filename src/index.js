import "./styles.css";
import{ Projects } from "./projects.js";
import{ Todo } from "./todo.js"; 

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
  