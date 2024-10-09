// app.js

let currentFilter = 'all'; // 'all', 'active', or 'completed'

// Selectors
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Task Array
let tasks = [];

// Load tasks from localStorage on page load
window.onload = () => {
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    renderTasks();
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
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  } else {
    alert("Please enter a task description.");
  }
};

// Save Tasks to localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Render Tasks
const renderTasks = () => {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    // Create task item elements
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTask(task.id);

    // Task description
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.description;
    if (task.completed) {
      taskText.classList.add("completed");
    }

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.onclick = () => editTask(task.id);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = () => deleteTask(task.id);

    // Append elements
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);

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

// Edit Task
const editTask = (id) => {
  const newDescription = prompt(
    "Edit the task description:",
    tasks.find((task) => task.id === id).description
  );
  if (newDescription !== null) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, description: newDescription.trim() } : task
    );
    saveTasks();
    renderTasks();
  }
};

// Delete Task
const deleteTask = (id) => {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }
};

// Event Listeners
addTaskBtn.addEventListener("click", addTask);

// Add task on "Enter" key press
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
