let allTasks = [];
let valueInput = "";
const activatedEditTask = null;
const URL = "http://localhost:8000";

window.onload = async () => {
  input = document.getElementById("input-todo");
  if (input === null) {
    return;
  }
  input.addEventListener("change", updateValue);
  const resp = await fetch(`${URL}/allTasks`, {
    method: "GET",
  });
  const result = await resp.json();
  allTasks = result;
  render();
};

const addButtonValues = async () => {
  if (valueInput.trim() === "") {
    return;
  }

  const resp = await fetch(`${URL}/createTask`, {
    method: "POST",
    headers: { "Content-type": "application/json;charset=utf-8" },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    }),
  });

  const result = await resp.json();

  allTasks.push(result);
  valueInput = "";
  input.value = "";

  render();
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.forEach(({ _id, isCheck, text }) => {
    const container = document.createElement("div");
    container.id = `task-${_id}`;
    container.classList = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCheck;
    checkbox.onchange = () => {
      onChangeCheckBox(_id);
    };

    const textCreater = document.createElement("p");
    textCreater.innerText = text;
    textCreater.className = isCheck ? "text-task done-text" : "text-task";

    const editButton = document.createElement("button");
    editButton.onclick = () => {
      updateTaskText(_id);
    };
    const imageEdit = document.createElement("img");
    imageEdit.src = "img/pencil-fill.svg";

    const imageButton = document.createElement("button");
    imageButton.onclick = () => {
      onDeleteTask(_id);
    };
    const imageDelete = document.createElement("img");
    imageDelete.src = "img/x-circle-fill.svg";

    imageButton.appendChild(imageDelete);
    editButton.appendChild(imageEdit);
    container.appendChild(checkbox);
    container.appendChild(textCreater);
    container.appendChild(editButton);
    container.appendChild(imageButton);
    content.appendChild(container);
  });
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const onChangeCheckBox = async (index) => {
    allTasks[index].isCheck = !allTasks[index].isCheck;
    render();
};

const onDeleteTask = async (id) => {
  try {
    const resp = await fetch(`${URL}/deleteTask`, {
      method: "DELETE",
      headers: { "Content-type": "application/json;charset=utf-8" },
      body: JSON.stringify({ _id: id }),
    });

    const result = await resp.json();
    if (result.deletedCount !== 1) {
      throw new Error();
    }

    const updatedTask = allTasks.filter((item) => item._id !== id);
    allTasks = updatedTask;
    render();
  } catch (error) {
    console.log(error);
  }
};

const updateTaskText = async (id) => {
  const initText = prompt("vvedite", "");
  allTasks[index].text = initText;
  render();
};

const doneEditTask = async () => {
  activatedEditTask = null;
  render();
};
