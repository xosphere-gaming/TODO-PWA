window.onload = () => {
    document.querySelector('#task-section').style.height =
    (document.documentElement.clientHeight - document.querySelector('#edit-section').scrollHeight).toString() + 'px';
    document.querySelector('#create-task-popup-container').style.height =
    document.documentElement.clientHeight.toString() + 'px';

    // Fetch data from local storage and update tasks.
    let saveData = localStorage.getItem('saveData');
    if (saveData) {
        saveData = JSON.parse(saveData);
        for (let i = 0 ; i < saveData.length ; i++) {
            addTask(saveData[i].title);
            if (saveData[i].status == 'true') { changeState(document.querySelector('#task-section').lastElementChild); }
        }
    }

    // Event listeners
    document.querySelector('.plus-btn').addEventListener('click', () => {
        document.querySelector('#create-task-popup-container').style.display = 'flex';
        let op = 0.1;
        let timer = setInterval(() => {
            if(op >= 1) { clearInterval(timer); }
            document.querySelector('#create-task-popup-container').style.opacity = op;
            op += op * 0.1;
        }, 5);
    });

    document.querySelector('#add-btn').addEventListener('click', () => {
        let data = document.querySelector('textarea').value.trim();
        if (!data) {
            document.querySelector('textarea').value = data;
            return;
        }
        document.querySelector('textarea').value = '';

        let op = 1;
        let timer = setInterval(() => {
            if(op <= 0.1) { clearInterval(timer); }
            document.querySelector('#create-task-popup-container').style.opacity = op;
            op -= op * 0.1;
        }, 5);
        setTimeout(() => {
        document.querySelector('#create-task-popup-container').style.display = 'none';
        }, 200);
        setTimeout(() => { addTask(data) }, 300);
    });

    document.querySelector('.undo-btn').addEventListener('click', () => {
        let children = document.querySelector('#task-section').children;
        for (let i = 0 ; i < children.length ; i++) {
            let task = children[i];
            if (task.getAttribute('data-done') == 'true') {
                let task_title = task.firstElementChild;
                task_title.textContent = task_title.firstElementChild.textContent;
                task.lastElementChild.textContent = 'check_box_outline_blank';
                task.setAttribute('data-done', 'false');
            }
        }
        updateLocalStorage();
    });

    document.querySelector('.del-btn').addEventListener('click', () => {
        let children = document.querySelector('#task-section').children;
        for (let i = 0 ; i < children.length ; i++) {
            let task = children[i];
            if (task.getAttribute('data-done') == 'true') {
                task.remove();
            }
        }
        updateLocalStorage();
    });

    document.querySelector('#close-btn').addEventListener('click', () => {
        document.querySelector('textarea').value = '';
        let op = 1;
        let timer = setInterval(() => {
            if(op <= 0.1) { clearInterval(timer); }
            document.querySelector('#create-task-popup-container').style.opacity = op;
            op -= op * 0.1;
        }, 5);
        setTimeout(() => {
        document.querySelector('#create-task-popup-container').style.display = 'none';
        }, 150);
    });

    document.querySelector('.save-btn').addEventListener('click', () => {
        if (!localStorage.getItem('saveData') || localStorage.getItem('saveData') == '\[\]') { return; }
        let el = document.createElement('a');
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(localStorage.getItem('saveData')));
        el.setAttribute('download', 'saveData-VulnX-TODO.vdata');
        el.style.display = 'none';
        document.body.appendChild(el);
        el.click();
        el.remove();
    });

    document.querySelector('.open-btn').addEventListener('click', () => {
        document.querySelector('input').click();
    });
}

function addTask(title) {
    let task_div = document.createElement('div');
    task_div.setAttribute('data-done', 'false');
    task_div.setAttribute('onclick', 'changeState(this)');
    task_div.classList.add('task');
    let title_span = document.createElement('span');
    title_span.textContent = title;
    let checkbox_span = document.createElement('span');
    checkbox_span.classList.add('material-symbols-outlined');
    checkbox_span.textContent = 'check_box_outline_blank';
    task_div.appendChild(title_span);
    task_div.appendChild(checkbox_span);
    document.querySelector('#task-section').appendChild(task_div);
    document.querySelector('#task-section').scrollTop = document.querySelector('#task-section').scrollHeight;
    updateLocalStorage();
}

function changeState(element) {
    if (element.getAttribute('data-done') == 'false') {
        let task_title = element.firstElementChild;
        let new_data = document.createElement('strike');
        new_data.textContent = task_title.textContent;
        task_title.textContent = '';
        task_title.appendChild(new_data);
        element.lastElementChild.textContent = 'check_box';
        element.setAttribute('data-done', 'true');
        updateLocalStorage();
    } else if (element.getAttribute('data-done') == 'true') {
        let task_title = element.firstElementChild;
        task_title.textContent = task_title.firstElementChild.textContent;
        element.lastElementChild.textContent = 'check_box_outline_blank';
        element.setAttribute('data-done', 'false');
        updateLocalStorage();
    }
}

function updateLocalStorage() {
    let tasks_data = [];
    let children = document.querySelector('#task-section').children;
    for (let i = 0 ; i < children.length ; i++) {
        let task = {
            "status": children[i].getAttribute('data-done'),
            "title": children[i].firstElementChild.textContent
        }
        tasks_data.push(task);
    }
    localStorage.setItem('saveData', JSON.stringify(tasks_data));
}

function handleOpenFile() {
    let file = document.querySelector('input').files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = (e) => {
            document.querySelector('#task-section').textContent = '';
            let tasks = JSON.parse(e.target.result);
            for (let i = 0 ; i < tasks.length ; i++) {
                let task = tasks[i];
                addTask(task.title);
                if (task.status == 'true') { changeState(document.querySelector('#task-section').lastElementChild); }
            }
        }
        reader.onerror = (e) => { alert("Error opening file."); }
    }
}
