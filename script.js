const input = document.querySelector(".todo-input");
const descriptionInput = document.querySelector(".todo-description");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <div class="todo-title" onclick="toggleDescription(this)">
        <label for="${index}">
          <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
          <span class="${checked}">${todo.name}</span>
        </label>
        <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
      </div>
      ${todo.description ? `<div class="todo-description-text">${todo.description}</div>` : ''}
    </li>
  `; 
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo() {
  let todo = input.value.trim();
  let description = descriptionInput.value.trim();
  if (!todo) {
    return;
  }
  input.value = "";
  descriptionInput.value = "";
  todosJson.unshift({ name: todo, description: description, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function handleKeyUp(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

input.addEventListener("keyup", handleKeyUp);
descriptionInput.addEventListener("keyup", handleKeyUp);
addButton.addEventListener("click", addTodo);

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

filters.forEach(el => {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

function toggleDescription(todoTitle) {
  todoTitle.classList.toggle('active');
  const description = todoTitle.nextElementSibling;
  if (description) {
    description.style.display = description.style.display === 'block' ? 'none' : 'block';
  }
}