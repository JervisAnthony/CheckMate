// Selectors
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Filter Buttons
const filterAllBtn = document.getElementById('filter-all');
const filterActiveBtn = document.getElementById('filter-active');
const filterCompletedBtn = document.getElementById('filter-completed');

// Delete All Tasks Button
const deleteAllBtn = document.getElementById('delete-all-btn');

// Theme Toggle
const themeSwitch = document.getElementById('theme-switch');

// Task Array
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', or 'completed'

// Load tasks and theme on page load
window.onload = () => {
  // Load tasks
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    renderTasks();
  }

  // Load theme
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeSwitch.checked = true;
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeSwitch.checked = false;
  }
};

// Add Task
const addTask = () => {
  const description = taskInput.value.trim();
  if (description) {
    const task = {
      id: Date.now(),
      description,
      completed: false,
      selected: false, // For highlighting
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  } else {
    alert('Please enter a task description.');
  }
};

// Save Tasks to localStorage
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Render Tasks
const renderTasks = () => {
  taskList.innerHTML = '';

  // Filter tasks based on currentFilter
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    // Create task item elements
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-id', task.id);

    // Highlight selected task
    if (task.selected) {
      taskItem.classList.add('selected');
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTask(task.id);

    // Task description
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.description;
    if (task.completed) {
      taskText.classList.add('completed');
    }

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit" aria-hidden="true"></i>';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent triggering task selection
      editTask(task.id);
    };

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i>';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent triggering task selection
      deleteTask(task.id);
    };

    // Append elements
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);

    // Click to select/highlight a task
    taskItem.onclick = (e) => {
      // Avoid toggling selection when clicking on buttons or checkbox
      if (e.target === taskItem || e.target === taskText) {
        selectTask(task.id);
      }
    };

    taskList.appendChild(taskItem);
  });
};

// Toggle Task Completion
const toggleTask = (id) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
};

// Select Task (for highlighting)
const selectTask = (id) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, selected: !task.selected } : { ...task, selected: false }
  );
  renderTasks();
};

// Edit Task
const editTask = (id) => {
  const taskToEdit = tasks.find((task) => task.id === id);
  const newDescription = prompt('Edit the task description:', taskToEdit.description);
  if (newDescription !== null && newDescription.trim() !== '') {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, description: newDescription.trim() } : task
    );
    saveTasks();
    renderTasks();
  }
};

// Delete Individual Task
const deleteTask = (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    // Remove task from array
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }
};

// Delete All Tasks
const deleteAllTasks = () => {
  if (tasks.length === 0) {
    alert('There are no tasks to delete.');
    return;
  }

  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
};

// Update Filter Buttons
const updateFilterButtons = () => {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  if (currentFilter === 'all') {
    filterAllBtn.classList.add('active');
  } else if (currentFilter === 'active') {
    filterActiveBtn.classList.add('active');
  } else if (currentFilter === 'completed') {
    filterCompletedBtn.classList.add('active');
  }
};

// Event Listeners for Filter Buttons
filterAllBtn.addEventListener('click', () => {
  currentFilter = 'all';
  updateFilterButtons();
  renderTasks();
});

filterActiveBtn.addEventListener('click', () => {
  currentFilter = 'active';
  updateFilterButtons();
  renderTasks();
});

filterCompletedBtn.addEventListener('click', () => {
  currentFilter = 'completed';
  updateFilterButtons();
  renderTasks();
});

// Event Listener for Delete All Tasks Button
deleteAllBtn.addEventListener('click', deleteAllTasks);

// Event Listener for Theme Toggle
themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

// Add task on "Enter" key press
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});
