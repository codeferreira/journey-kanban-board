export function TaskComponent(task) {
  return `
  <div id="${task.id}" class="task" draggable="true">
    <p>${task.description}</p>
  </div>
  `
}