const newNodeButton = document.getElementById('createNewNode');
const formSelect = document.querySelector('form select');

let flag = false;

const setStartDate = function () {
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    const today = year + "-" + month + "-" + day;
    document.getElementById("date").value = today;
}

const createInputBar = function () {
    outer.setAttribute('class', 'input-group');
    outer.setAttribute('id', 'newTopicName');
    const span = document.createElement('span');
    span.setAttribute('class', 'input-group-text');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'topic');
    input.setAttribute('class', 'form-control');
    span.innerText = "Node";
    outer.appendChild(span);
    outer.appendChild(input);
}

const outer = document.createElement('div');

createInputBar();

newNodeButton.addEventListener('click', () => {
    console.log('clicked!');
    if (flag) {
        document.querySelector("#newTopicName").replaceWith(formSelect);
        document.querySelector("#createNewNode").classList.replace("btn-warning", "btn-primary");
        document.querySelector("#createNewNode").innerText = "Create new topic";
        flag = !flag;
    }
    else {
        formSelect.replaceWith(outer);
        document.querySelector("#createNewNode").innerText = "Cancel";
        document.querySelector("#createNewNode").classList.replace("btn-primary", "btn-warning");
        flag = !flag;
    }
})