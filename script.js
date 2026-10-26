const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const timeInput = document.getElementById('task-time');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const taskCount = document.getElementById('task-count');
const STORAGE_KEY = 'pinkTodoTasksV1';

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

function formatTime(value) {
  if (!value) return 'Time not set';
  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function renderTasks() {
  taskList.replaceChildren();
  const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

  sortedTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.type = 'button';
    completeButton.setAttribute('aria-label', task.completed ? 'Mark task incomplete' : 'Mark task complete');
    completeButton.textContent = task.completed ? '✓' : '';
    completeButton.addEventListener('click', () => {
      tasks = tasks.map((entry) => entry.id === task.id ? { ...entry, completed: !entry.completed } : entry);
      saveTasks();
      renderTasks();
    });

    const details = document.createElement('div');
    details.className = 'task-details';
    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.text;
    const time = document.createElement('div');
    time.className = 'task-time';
    time.textContent = `🕒 ${formatTime(task.time)}`;
    details.append(title, time);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(completeButton, details, deleteButton);
    taskList.append(item);
  });

  emptyMessage.hidden = tasks.length > 0;
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
}

form.addEventListener('submit', (event) => {
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
