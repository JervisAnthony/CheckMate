// Adding a Task
let tasks = [];

// Load tasks from local storage on page load
window.onload = () => {
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    renderTasks();
  }
};

const addTask = () => {
  const taskInput = document.getElementById('task-input');
  const description = taskInput.value.trim();
  
  if (description) {
    const task = {
      id: Date.now(),
      description,
      completed: false,
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  } else {
    alert('Please enter a task description.');
  }
};

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Rendering Tasks
const renderTasks = () => {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  
  tasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTask(task.id);

    // Task Description
    const taskDescription = document.createElement('span');
    taskDescription.textContent = task.description;
    if (task.completed) {
      taskDescription.classList.add('completed');
    }

    // Edit Button
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.onclick = () => editTask(task.id);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = () => deleteTask(task.id);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskDescription);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  });
};
