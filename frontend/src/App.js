// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [items, setItems] = useState([]);
//   const [name, setName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

//   useEffect(() => {
//     fetchItems();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function fetchItems() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/items`);
//       setItems(res.data);
//     } catch (err) {
//       console.error('Error fetching items:', err);
//       // minimal error UX
//       alert('Failed to load items (check server).');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function addItem(e) {
//     e.preventDefault();
//     if (!name.trim()) return;
//     try {
//       const res = await axios.post(`${API_BASE}/items`, { name: name.trim() });
//       // append newly created item
//       setItems((prev) => [...prev, res.data]);
//       setName('');
//     } catch (err) {
//       console.error('Error adding item:', err);
//       alert('Failed to add item.');
//     }
//   }

//   return (
//     <div className="container">
//       <h1>My Items</h1>

//       <form onSubmit={addItem} className="form">
//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Enter new item name"
//           className="input"
//         />
//         <button type="submit" className="btn">Add</button>
//       </form>

//       <hr />

//       {loading ? (
//         <p>Loading items…</p>
//       ) : items.length === 0 ? (
//         <p>No items yet.</p>
//       ) : (
//         <ul className="list">
//           {items.map((it) => (
//             <li key={it._id || it.id} className="list-item">
//               {it.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './App.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// function App() {
//   const [users, setUsers] = useState([]);
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     income: '',
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//     // eslint-disable-next-line
//   }, []);

//   async function fetchUsers() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/users`);
//       setUsers(res.data);
//     } catch (err) {
//       console.error('Failed to load users:', err);
//       alert('Failed to load users (check backend).');
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (!form.name.trim() || !form.email.trim()) {
//       alert('Name and email are required');
//       return;
//     }

//     try {
//       const payload = {
//         name: form.name,
//         email: form.email,
//         phone: form.phone,
//         income: form.income ? Number(form.income) : 0,
//       };
//       const res = await axios.post(`${API_BASE}/users`, payload);
//       // add to list (newly created user)
//       setUsers((prev) => [res.data, ...prev]);
//       setForm({ name: '', email: '', phone: '', income: '' });
//     } catch (err) {
//       console.error('Error creating user:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         alert('Error: ' + err.response.data.error);
//       } else {
//         alert('Failed to create user.');
//       }
//     }
//   }

//   return (
//     <div className="container">
//       <h1>User Manager</h1>

//       <form onSubmit={handleSubmit} className="form user-form">
//         <input
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           className="input"
//           placeholder="Full name"
//         />
//         <input
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//           className="input"
//           placeholder="Email"
//         />
//         <input
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           className="input"
//           placeholder="Phone (optional)"
//         />
//         <input
//           name="income"
//           value={form.income}
//           onChange={handleChange}
//           className="input"
//           placeholder="Income (numbers only)"
//         />
//         <div className='btn-save'>
//           <button type="submit" className="btn">Save User</button>
//         </div>
        
//       </form>

//       <hr />

//       <h2>Users</h2>
//       {loading ? (
//         <p>Loading users...</p>
//       ) : users.length === 0 ? (
//         <p>No users yet.</p>
//       ) : (
//         <ul className="list">
//           {users.map((u) => (
//             <li key={u._id} className="list-item">
//               <div><strong>{u.name}</strong> <span className="muted">({u.email})</span></div>
//               <div className="muted">Phone: {u.phone || '—'} • Income: {u.income ?? 0}</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', income: '' });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // null => create mode, otherwise edit mode
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
      alert('Failed to load users (check backend).');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert('Name and email are required');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      income: form.income ? Number(form.income) : 0,
    };

    try {
      setSaving(true);
      if (editId) {
        // Update existing user
        const res = await axios.put(`${API_BASE}/users/${editId}`, payload);
        setUsers((prev) => prev.map((u) => (u._id === editId ? res.data : u)));
        setEditId(null);
      } else {
        // Create new user
        const res = await axios.post(`${API_BASE}/users`, payload);
        setUsers((prev) => [res.data, ...prev]);
      }
      setForm({ name: '', email: '', phone: '', income: '' });
    } catch (err) {
      console.error(editId ? 'Error updating user:' : 'Error creating user:', err);
      const msg = err?.response?.data?.error || 'Failed to save user.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(user) {
    setEditId(user._id);
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      income: user.income != null ? String(user.income) : '',
    });
    // scroll to top / form if needed:
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      // if currently editing that user, reset form
      if (editId === id) {
        setEditId(null);
        setForm({ name: '', email: '', phone: '', income: '' });
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    }
  }

  function handleCancelEdit() {
    setEditId(null);
    setForm({ name: '', email: '', phone: '', income: '' });
  }

  return (
    <div className="container">
      <h1>User Manager</h1>

      <form onSubmit={handleSubmit} className="form user-form">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input"
          placeholder="Full name"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input"
          placeholder="Email"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="input"
          placeholder="Phone (optional)"
        />
        <input
          name="income"
          value={form.income}
          onChange={handleChange}
          className="input"
          placeholder="Income (numbers only)"
        />

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? (editId ? 'Updating...' : 'Saving...') : editId ? 'Update User' : 'Save User'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                background: '#efefef',
                color: '#111',
                border: 'none',
                padding: '10px 14px',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

      <h2>Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users yet.</p>
      ) : (
        <ul className="list">
          {users.map((u) => (
            <li key={u._id} className="list-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div><strong>{u.name}</strong> <span className="muted">({u.email})</span></div>
                  <div className="muted">Phone: {u.phone || '—'} • Income: {u.income ?? 0}</div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleEdit(u)}
                    style={{
                      background: '#fff',
                      border: '1px solid #d1d5db',
                      padding: '8px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                    title="Edit"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{
                      background: '#ffe9e9',
                      border: '1px solid #f5c2c2',
                      padding: '8px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

