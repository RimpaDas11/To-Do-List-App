const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const errorMsg = document.getElementById("errorMsg");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

// Load tasks from localStorage on page load
window.onload = function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task.text, task.completed, task.priority, task.dueDate));
};

// Save tasks to localStorage
function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text").innerText,
      completed: li.classList.contains("completed"),
      priority: li.getAttribute("data-priority"),
      dueDate: li.getAttribute("data-dueDate")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
addBtn.addEventListener("click", addTask);

function addTask() {
  let taskText = taskInput.value.trim();
  let priority = prioritySelect.value;
  let dueDate = dueDateInput.value;

  // Validation
  if (taskText === "") {
    errorMsg.innerText = "⚠ Task cannot be empty!";
    return;
  }
  errorMsg.innerText = "";

  renderTask(taskText, false, priority, dueDate);
  saveTasks();

  // Clear input fields
  taskInput.value = "";
  dueDateInput.value = "";
}

// Render task in list
function renderTask(taskText, completed, priority, dueDate) {
  let li = document.createElement("li");
  if (completed) li.classList.add("completed");
  li.setAttribute("data-priority", priority);
  li.setAttribute("data-dueDate", dueDate);

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.onchange = function () {
    li.classList.toggle("completed");
    saveTasks();
  };

  let details = document.createElement("div");
  details.classList.add("task-details");

  let span = document.createElement("span");
  span.classList.add("task-text");
  span.innerText = taskText;

  let meta = document.createElement("small");
  meta.classList.add("task-meta");
  meta.innerText = `Priority: ${priority} | Due: ${dueDate || "N/A"}`;

  details.appendChild(span);
  details.appendChild(meta);

  let actions = document.createElement("div");
  actions.classList.add("actions");

  // Edit button
  let editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.onclick = function () {
    let newText = prompt("Edit task:", span.innerText);
    if (newText && newText.trim() !== "") {
      span.innerText = newText.trim();
      saveTasks();
    }
  };

  // Delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = function () {
    li.remove();
    saveTasks();
  };

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(details);
  li.appendChild(actions);
  taskList.appendChild(li);
}
