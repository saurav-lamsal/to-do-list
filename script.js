window.addEventListener("load", function () {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(function (taskText) {
        addTask(taskText);
    });
});

let addBtn = document.querySelector('#add-btn');
let newTaskInput = document.querySelector('#wrapper input');
let taskContainer = document.querySelector('#tasks');

function addTask(taskName) {
    // Display the task
    const task = `<div class="task">
        <span class="taskname">${taskName}</span>
        <div class="edit-delete-btn">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    </div>`;
    taskContainer.insertAdjacentHTML("beforeend", task);

    // Attach event listeners
    attachEventListeners();
}

function attachEventListeners() {
    // Edit 
    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(editBtn => {
        editBtn.addEventListener("click", function () {
            editTask(editBtn.parentElement.parentNode.querySelector(".taskname"));
        });
    });
    // Delete
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const taskElement = button.parentElement.parentNode;
            const taskName = taskElement.querySelector(".taskname").textContent;
            deleteTask(taskName);
            taskElement.remove();
        });
    });
}

function editTask(taskElement) {
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskElement.textContent.trim();
    inputField.classList.add("edit-input");
    const originalTaskName = taskElement.textContent.trim();
    taskElement.textContent = "";
    taskElement.appendChild(inputField);
    inputField.focus();

    function revertToDiv() {
        const newText = inputField.value.trim();
        if (newText !== "") {
            taskElement.textContent = newText;

            // Update tasks array in local storage
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const index = tasks.indexOf(originalTaskName);
            tasks[index] = newText;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } else {
            taskElement.textContent = originalTaskName;
        }
        inputField.removeEventListener("blur", revertToDiv);
    }
    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            revertToDiv();
        }
    });

    inputField.addEventListener("blur", revertToDiv);
}

// Function to delete a task from local storage
function deleteTask(taskName) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const index = tasks.indexOf(taskName);
    if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

addBtn.addEventListener("click", function () {
    let taskName = newTaskInput.value.trim();
    if (taskName !== "") {
        addTask(taskName);
        updateTasksLocalStorage();
        newTaskInput.value = "";
    }
});

newTaskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        let taskName = newTaskInput.value.trim();
        if (taskName !== "") {
            addTask(taskName);
            updateTasksLocalStorage();
            newTaskInput.value = "";
        }
    }
});

// Function to update tasks in local storage
function updateTasksLocalStorage() {
    let tasks = [];
    document.querySelectorAll('.taskname').forEach(task => {
        tasks.push(task.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initial attachment of event listeners
attachEventListeners();
