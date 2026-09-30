// タスクの一覧（画面はこの配列から毎回描画する）
let tasks = [];
let nextId = 1;
// 編集中のタスクID（編集中でなければ null）
let editingId = null;
// 編集中の入力内容（再描画しても入力途中の文字が消えないよう状態として保持する）
let editingText = '';

const taskInput = document.getElementById('task-input');
const taskForm = document.querySelector('.task-form');
const taskList = document.getElementById('task-list');
const counts = document.getElementById('counts');

// Create：入力内容をタスクとして追加する（ボタンのクリックと Enter キーのどちらでも submit される）
taskForm.addEventListener('submit', (event) => {
  // フォーム送信によるページの再読み込みを防ぐ
  event.preventDefault();
  const text = taskInput.value.trim();
  if (text === '') {
    return;
  }
  tasks.push({ id: nextId++, text: text, done: false });
  taskInput.value = '';
  render();
});

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.done = !task.done;
  render();
}

function startEdit(id) {
  const task = tasks.find((t) => t.id === id);
  editingId = id;
  editingText = task.text;
  render();
}

// Update：編集フォームの内容で更新する
function saveEdit(id) {
  const text = editingText.trim();
  if (text === '') {
    return;
  }
  const task = tasks.find((t) => t.id === id);
  task.text = text;
  editingId = null;
  editingText = '';
  render();
}

// Delete：確認ダイアログでOKのときだけ削除する
function deleteTask(id) {
  if (!confirm('本当に削除してもよろしいですか？')) {
    return;
  }
  tasks = tasks.filter((t) => t.id !== id);
  if (editingId === id) {
    editingId = null;
    editingText = '';
  }
  render();
}

function createButton(label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function createTaskItem(task) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => toggleTask(task.id));
  li.appendChild(checkbox);

  if (task.id === editingId) {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = editingText;
    editInput.addEventListener('input', () => {
      editingText = editInput.value;
    });
    li.appendChild(editInput);
    li.appendChild(createButton('保存', () => saveEdit(task.id)));
  } else {
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    li.appendChild(span);
    li.appendChild(createButton('編集', () => startEdit(task.id)));
  }

  li.appendChild(createButton('削除', () => deleteTask(task.id)));
  return li;
}

// 件数を再計算して表示する
function renderCounts() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  counts.textContent = `全てのタスク：${total} 完了済み：${done} 未完了：${total - done}`;
}

// Read：一覧と件数を描画する（状態が変わるたびに呼ぶ）
function render() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    taskList.appendChild(createTaskItem(task));
  });
  renderCounts();
}

render();
