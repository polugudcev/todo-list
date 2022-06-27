//const getButton = document.querySelector("button");
let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let valueInput = "";
let input = null;
let activatedEditTask = null;

window.onload = function init() {
  input = document.getElementById("input-todo");
  input.addEventListener("change", updateValue);
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const clickOnButton = () => {
  if (valueInput === "") {
    return;
  }
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  valueInput = "";
  input.value = "";

  render();
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.forEach((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.classList = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = function () {
      onChangeCheckBox(index);
    };

    container.appendChild(checkbox);
    const text = document.createElement("p");
    text.innerText = item.text;
    text.className = item.isCheck ? "text-task done-text" : "text-task";
    container.appendChild(text);

    const imageEdit = document.createElement("img");
    imageEdit.src = "img/pencil-fill.svg";
    imageEdit.onclick = () => {
      updateTaskText(item, index);
    };
    container.appendChild(imageEdit);

    const imageDelete = document.createElement("img");
    imageDelete.src = "img/x-circle-fill.svg";
    imageDelete.onclick = function () {
      onDeleteTask();
    };
    container.appendChild(imageDelete);

    content.appendChild(container);
  });
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const onChangeCheckBox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const onDeleteTask = (index) => {
  allTasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const updateTaskText = (event, index) => {
  const initText = prompt("vvedite", "");
  allTasks[index].text = initText;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const doneEditTask = () => {
  activatedEditTask = null;
  render();
};
