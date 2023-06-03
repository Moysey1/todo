(function () {
  let todoArr = [];
  let keyName = '';


  function createAppTitle (title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('id', 'addTodo')
    button.setAttribute("disabled", "disabled");
    button.textContent = 'Добавить дело';


    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('keyup', function () {
      if (input.value) {
        button.removeAttribute('disabled');
      }
    })

    return {
      form,
      input,
      button,
    };
  }



  function createTodoList () {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem (obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    let buttonDisabled = document.querySelector('#addTodo');


    item.classList.add('list-group-item' , 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;
    // item.setAttribute('id', `${id(obj)}`)
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done === true) {
      item.classList.add('list-group-item-success');
    }


    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (const listItem of todoArr) {
        if (listItem.id === obj.id) {
          listItem.done = !listItem.done;
        }
      }
      saveLocal(todoArr,keyName);
    });
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены')) {
        item.remove();
        for (let i =0; i < todoArr.length; i++) {
          if (todoArr[i].id === obj.id) {
            todoArr.splice(i,1);
          }
        }
        saveLocal(todoArr,keyName);
      }
    })

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    buttonDisabled.setAttribute('disabled', 'disabled');


    return {
      item,
      doneButton,
      deleteButton,
    };

  }

  function id (array) {
    let max = 0;
    for (const item of array) {
      if(item.id > max) {
        max = item.id;
      }

    }
    return max+1;
  }

  function saveLocal (arr, listName) {
    localStorage.setItem(listName, JSON.stringify(arr));
  }


  function createTodoApp (container, title = 'Список дел', listName) {
    let todoAppTitle = createAppTitle(title)
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    keyName = listName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(keyName);


    if (localData !== null && localData !== '') {
      todoArr = JSON.parse(localData);
    }

    for (const itemList of todoArr) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }




    todoItemForm.form.addEventListener('submit', function (e) {

      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: id(todoArr),
        name: todoItemForm.input.value,
        done: false,

      }

      let todoItem = createTodoItem(newItem);

      todoArr.push(newItem);

      saveLocal(todoArr,keyName);

      todoList.append(todoItem.item);

      todoItemForm.input.value = '';



    })

  }



  window.createTodoApp = createTodoApp;

})();
