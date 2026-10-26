const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const taskCount = document.getElementById('task-count');
const STORAGE_KEY = 'pink-todo-list-tasks';

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
  if (!time) return 'Time not set';
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderTasks() {
  taskList.replaceChildren();
  tasks.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
  emptyMessage.hidden = tasks.length > 0;
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;

  tasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.type = 'button';
    completeButton.setAttribute('aria-label', task.completed ? 'Mark task incomplete' : 'Mark task complete');
    completeButton.textContent = task.completed ? '✓' : '';
    completeButton.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const details = document.createElement('div');
    details.className = 'task-details';
    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    const time = document.createElement('span');
    time.className = 'task-time';
    time.textContent = `🕒 ${formatTime(task.time)}`;
    details.append(text, time);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(completeButton, details, deleteButton);
    taskList.append(item);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  const time = taskTime.value;
  if (!text || !time) return;
  tasks.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, time, completed: false });
  saveTasks();
  renderTasks();
  form.reset();
  taskInput.focus();
});

renderTasks();
