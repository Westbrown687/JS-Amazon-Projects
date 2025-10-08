const todoList = [
  { todoName: "Wash Cars", dueDate: "2025-10-03" },
  { todoName: "Wash plates", dueDate: "2025-10-03" },
];

function displayPage() {
  let todoListHTML = "";
  todoList.forEach((value, index) => {
    const todoName = value.todoName;
    const todoDate = value.dueDate;
    const todo = `<div>${todoName}</div> <div>${todoDate}</div>
            <button class="delete-css js-deletebutton">Delete</button>
            `;

    todoListHTML += todo;
  });

  console.log(todoListHTML);

  document.querySelector(".display").innerHTML = todoListHTML;

  const deleteButtonElement = document.querySelectorAll(".js-deletebutton");

  deleteButtonElement.forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", () => {
      todoList.splice(index, 1);
      displayPage();
    });
  });
}

function addTodo() {
  const nameInput = document.querySelector(".js-todo");
  const dateInput = document.querySelector(".js-date");

  const name = nameInput.value;
  const date = dateInput.value;

  todoList.push({ todoName: name, dueDate: date });
  console.log(todoList);

  nameInput.value = "";
  dateInput.value = "";
  displayPage();
}
