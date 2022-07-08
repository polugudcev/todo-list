let allTasks = [];
const URL = "http://localhost:8000";
let newEditTask = "";

window.onload = async () => {
  const input = document.getElementById("input-todo");
  if (input === null) {
    return;
  }
  input.addEventListener("change", updateValue);
  allTasks = await fetchAllTasks();
  render();
};

const fetchAllTasks = async () => {
  try {
    const resp = await fetch(`${URL}/allTasks`, {
      method: "GET",
      headers: { "Content-type": "application/json;charset=utf-8" },
    });

    const result = await resp.json();
    return result;
  } catch (error) {
    alert("Error");
  }
};

const addNewTask = async () => {
  try {
    const input = document.getElementById("input-todo");
    if (input.value.trim() === "") {
      return;
    }

    const resp = await fetch(`${URL}/createTask`, {
      method: "POST",
      headers: { "Content-type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        text: input.value,
        isCheck: false,
      }),
    });

    const result = await resp.json();
    allTasks.push(result);
    input.value = "";
    render();
  } catch (error) {
    alert("Error");
  }
};

const updateValue = (event) => {
  input.value = event.target.value;
};

const onChangeCheckBox = async (id) => {
  const selectedTask = allTasks.find((item) => item._id === id);
  const { _id, isCheck = !isCheck } = selectedTask;
  allTasks[index].isCheck = !allTasks[index].isCheck;
  try {
    const resp = await fetch(`${URL}/updateTask`, {
      method: "PATCH",
      headers: { "Content-type": "application/json;charset=utf-8" },
      body: JSON.stringify({ _id, isCheck }),
    });

    const result = await resp.json();
  } catch (error) {
    alert("Error");
  }
  render();
};

const openEditBlock = (id) => {
  const taskBlock = document.querySelector(`#task-${id}`);
  taskBlock.classList.add("hidden");
  taskBlock.classList.remove("task");
  const editBlock = document.querySelector(`#edit-${id}`);
  editBlock.classList.remove("hidden");
  editBlock.classList.add("task");
};

const closeEditBlock = (id) => {
  const taskBlock = document.querySelector(`#task-${id}`);
  taskBlock.classList.remove("hidden");
  taskBlock.classList.add("task");
  const editBlock = document.querySelector(`#edit-${id}`);
  editBlock.classList.add("hidden");
  editBlock.classList.remove("task");
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
    alert("Error");
  }
};

const updateTaskText = async (id) => {
  const editInput = document.querySelector(`#input-${id}`);
  allTasks.find((item) => item._id === id);
  try {
    const resp = await fetch(`${URL}/updateTask`, {
      method: "PATCH",
      headers: { "Content-type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        text: editInput.value,
        _id: id,
      }),
    });

    const result = await resp.json();
    allTasks.forEach((element) => {
      if (element._id === id) {
        element.text = editInput.value;
      }
    });
    render();
    closeEditBlock();
  } catch (error) {
    
  }
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.forEach(({ _id, isCheck, text }) => {
    const container = document.createElement("div");
    container.classList = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCheck;
    checkbox.onchange = () => {
      onChangeCheckBox(_id);
    };

    const editBlock = document.createElement("div");
    editBlock.className = "hidden";

    const editNewInput = document.createElement("input");
    editNewInput.id = `input-${_id}`;

    editNewInput.value = text;
    editNewInput.onchange = (e) => {
      newEditTask = e.target.value;
    };

    const taskBlock = document.createElement("div");
    taskBlock.className = `task`;
    taskBlock.id = `task-${_id}`;

    const textCreater = document.createElement("p");
    textCreater.innerText = text;
    textCreater.className = isCheck ? "text-task done-text" : "text-task";

    const openEdit = document.createElement("button");
    openEdit.onclick = () => {
      openEditBlock(_id);
    };

    const imageEdit = document.createElement("img");
    imageEdit.src = "img/pencil-fill.svg";

    const deleteButton = document.createElement("button");
    deleteButton.onclick = () => {
      onDeleteTask(_id);
    };

    const imageDelete = document.createElement("img");
    imageDelete.src = "img/x-circle-fill.svg";

    const editButton = document.createElement("button");
    editButton.innerText = "add";
    editBlock.id = `edit-${_id}`;
    editButton.onclick = () => {
      updateTaskText(_id);
    };

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "cancel";
    cancelButton.onclick = () => {
      closeEditBlock(_id);
    };

    taskBlock.appendChild(checkbox);
    taskBlock.appendChild(textCreater);
    taskBlock.appendChild(openEdit);
    taskBlock.appendChild(deleteButton);
    editBlock.appendChild(editNewInput);
    editBlock.appendChild(editButton);
    editBlock.appendChild(cancelButton);
    openEdit.appendChild(imageEdit);
    deleteButton.appendChild(imageDelete);
    container.appendChild(taskBlock);
    container.appendChild(editBlock);
    content.appendChild(container);
  });
};
