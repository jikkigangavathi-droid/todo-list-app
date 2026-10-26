const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const timeInput = document.getElementById('task-time');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const STORAGE_KEY = 'cursive-pink-todo-tasks';

let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatTime(time) {
  if (!time) return 'No time set';
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderTasks() {
  taskList.replaceChildren();
  tasks.sort((a, b) => a.time.localeCompare(b.time));
  emptyMessage.hidden = tasks.length > 0;

  for (const task of tasks) {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(task.completed);
    checkbox.setAttribute('aria-label', `Mark ${task.text} complete`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const content = document.createElement('div');
    content.className = 'task-content';
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    const taskTime = document.createElement('span');
    taskTime.className = 'task-time';
    taskTime.textContent = `🕒 ${formatTime(task.time)}`;
    content.append(taskText, taskTime);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, content, deleteButton);
    taskList.append(item);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  const time = timeInput.value;
  if (!text || !time) return;

  tasks.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, time, completed: false });
  saveTasks();
  renderTasks();
  form.reset();
  taskInput.focus();
});

renderTasks();
