const loginBtn = document.getElementById("loginBtn");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const loginMsg = document.getElementById("loginMsg");
const controls = document.getElementById("controls");
const usersList = document.getElementById("usersList");
const itemsList = document.getElementById("itemsList");

let token = localStorage.getItem("admin_token") || null;

function setAuthHeader() {
  token = localStorage.getItem("admin_token");
}

async function login() {
  const email = emailEl.value;
  const password = passwordEl.value;

  try {
    const res = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    token = data.data.token;
    localStorage.setItem('admin_token', token);
    loginMsg.textContent = 'Logged in';
    controls.style.display = '';
    fetchUsers();
  } catch (err) {
    loginMsg.textContent = err.message;
  }
}

async function fetchUsers() {
  usersList.innerHTML = 'Loading users...';
  try {
    const res = await fetch('/admin-api/users', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed');
    renderUsers(json.data || []);
  } catch (err) {
    usersList.innerHTML = '<p style="color:red">' + err.message + '</p>';
  }
}

function renderUsers(users) {
  if (!users.length) {
    usersList.innerHTML = '<p>No users</p>';
    return;
  }
  const html = users.map(u => `
    <div class="userCard">
      <div><strong>${u.name}</strong> &lt;${u.email}&gt;</div>
      <div>Role: <select data-id="${u._id}" class="roleSelect">
        <option value="user" ${u.role==='user'?'selected':''}>user</option>
        <option value="admin" ${u.role==='admin'?'selected':''}>admin</option>
        <option value="worker" ${u.role==='worker'?'selected':''}>worker</option>
      </select></div>
      <div><button class="deleteBtn" data-id="${u._id}">Delete</button></div>
    </div>
  `).join('');

  usersList.innerHTML = html;

  document.querySelectorAll('.roleSelect').forEach(el => {
    el.addEventListener('change', async (e) => {
      const id = e.target.getAttribute('data-id');
      const role = e.target.value;
      try {
        await fetch(`/admin-api/users/${id}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ role })
        });
        fetchUsers();
      } catch (err) {
        alert('Error updating role');
      }
    });
  });

  document.querySelectorAll('.deleteBtn').forEach(el => {
    el.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (!confirm('Delete this user?')) return;
      try {
        await fetch(`/admin-api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + token }
        });
        fetchUsers();
      } catch (err) {
        alert('Error deleting user');
      }
    });
  });
}

async function fetchItems() {
  itemsList.innerHTML = 'Loading items...';
  try {
    const res = await fetch('/admin-api/items', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed');
    const items = json.data || [];
    if (!items.length) {
      itemsList.innerHTML = '<p>No items</p>';
      return;
    }
    itemsList.innerHTML = items.map(it => `
      <div class="itemCard">
        <div><strong>${it.title || '(no title)'}</strong></div>
        <div>User: ${it.user ? it.user.name + ' <' + it.user.email + '>' : '—'}</div>
      </div>
    `).join('');
  } catch (err) {
    itemsList.innerHTML = '<p style="color:red">' + err.message + '</p>';
  }
}

loginBtn.addEventListener('click', login);
document.getElementById('refreshUsers').addEventListener('click', fetchUsers);
document.getElementById('refreshItems').addEventListener('click', fetchItems);

if (token) {
  controls.style.display = '';
  fetchUsers();
}
