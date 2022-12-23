import { TaskComponent } from './components/task.js'

const formElement = document.getElementById("add-new-task");
const dropzones = document.querySelectorAll('.kanban__section__body')

const tasks = [
  { id: 1, description: 'Tasks', status: 'todo' },
  { id: 2, description: 'Tasks 2', status: 'in-progress' },
  { id: 3, description: 'Tasks 3', status: 'done' },
  { id: 4, description: 'Live', status: 'todo' },
];

function addDragListeners() {
  const draggables = document.querySelectorAll(".task");

  draggables.forEach(task => {
    task.addEventListener("dragstart", () => {
      task.classList.add('dragging');
    })

    task.addEventListener('dragend', () => {
      task.classList.remove('dragging');
    })
  })
}

function loadTasks(tasks = []) {
  const draggables = document.querySelectorAll(".task");
  draggables.forEach(draggable => draggable.remove());

  tasks.forEach(task => {
    const component = TaskComponent(task);

    const column = document.getElementById(task.status);

    column.innerHTML += component;
  })

  addDragListeners();
}

window.addEventListener('load', () => {
  loadTasks(tasks);
})

formElement.addEventListener('submit', (event) => {
  event.preventDefault();

  const description = document.forms['new-task']['description'].value;

  const newTask = {
    id: tasks.length + 1,
    description,
    status: 'todo',
  }

  tasks.concat(newTask);

  loadTasks([...tasks, newTask]);
})

function insertAbove(zone, mouseY) {
  const otherTasks = zone.querySelectorAll('.task:not(.dragging)');

  let nearstTask = null;
  let nearstOffset = Number.NEGATIVE_INFINITY;

  otherTasks.forEach(task => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > nearstOffset) {
      nearstTask = task;
      nearstOffset = offset;
    }
  })

  return nearstTask;
}

dropzones.forEach(zone => {
  zone.addEventListener('dragover', (event) => {
    event.preventDefault();

    zone.classList.add('drop')

    const currentTask = document.querySelector('.dragging');
    const bottomTask = insertAbove(zone, event.clientY);

    if (!bottomTask) {
      zone.appendChild(currentTask);
      return;
    }

    zone.insertBefore(currentTask, bottomTask);
  })

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drop');
  });

  zone.addEventListener('dragend', () => {
    zone.classList.remove('drop');
  });
})
