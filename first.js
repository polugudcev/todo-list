//const getButton = document.querySelector("button");
let allTasks = [];
let valueInput = "";
//let input = null;
let activatedEditTask = null;

window.onload = async () => {
  input = document.getElementById("input-todo");
  if (input === null) {
    return }
    input.addEventListener("change", updateValue);
    // localStorage.setItem("tasks", JSON.stringify(allTasks));
    const resp = await fetch("http://localhost:3000/allTasks", {
      method: "GET",
    });
    let result = await resp.json();
    console.log(result);
    allTasks = result.data;
    render();
  };

const clickOnButton = async () => {
  if (valueInput === "") {
    return;
  }
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  const resp = await fetch("http://localhost:3000/createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    }),
  });
  let result = await resp.json();
  console.log(result);
  // allTasks = result.data;
  //localStorage.setItem("tasks", JSON.stringify(allTasks));
  valueInput = "";
  input.value = "";

  render();
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.classList = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => {
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

const onChangeCheckBox = async (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
 // localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const onDeleteTask = async (index) => {
  allTasks.splice(index, 1);
  //localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const updateTaskText = async (event, index) => {
  const initText = prompt("vvedite", "");
  allTasks[index].text = initText;
  //localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const doneEditTask = async () => {
  activatedEditTask = null;
  render();
};
