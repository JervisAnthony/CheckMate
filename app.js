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
