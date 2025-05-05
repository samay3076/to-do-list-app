let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const filterPriority = document.getElementById('filterPriority');
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const taskInput = document.getElementById('taskInput');
  const priority = document.getElementById('priority');
  const reminder = document.getElementById('reminder');
  
  const task = {
    id: Date.now(),
    title: taskInput.value,
    completed: false,
    priority: priority.value,
    reminder: reminder.value,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  saveToLocalStorage();
  renderTasks();
  taskForm.reset();
});
function renderTasks() {
  const priorityFilter = filterPriority.value;
  
  let filteredTasks = tasks;
  if (priorityFilter !== 'all') {
    filteredTasks = tasks.filter(task => task.priority === priorityFilter);
  }
  
  taskList.innerHTML = filteredTasks
    .sort((a, b) => {
      if (a.completed === b.completed) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.completed ? 1 : -1;
    })
    .map(task => `
      <li class="task-item ${task.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          ${task.completed ? 'checked' : ''} 
          onchange="toggleTask(${task.id})"
        />
        <div class="task-content">
          <h3 class="task-title">${task.title}</h3>
          <div class="task-details">
            <span class="priority-badge priority-${task.priority}">
              ${task.priority}
            </span>
            ${task.reminder ? `
              <span class="reminder">
                Reminder: ${new Date(task.reminder).toLocaleString()}
              </span>
            ` : ''}
          </div>
        </div>
        <button 
          onclick="deleteTask(${task.id})" 
          class="delete-btn"
        >
          Delete
        </button>
      </li>
    `).join('');
}
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveToLocalStorage();
  renderTasks();
}
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveToLocalStorage();
  renderTasks();
}
filterPriority.addEventListener('change', renderTasks);
renderTasks();
setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    if (task.reminder && !task.completed) {
      const reminderTime = new Date(task.reminder);
      if (now >= reminderTime) {
        alert(`Reminder: ${task.title}`);
        task.reminder = '';  
        saveToLocalStorage();
      }
    }
  });
}, 60000); 