import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE + '/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    if (!name) return;
    try {
      await axios.post(import.meta.env.VITE_API_BASE + '/items', { name });
      setName('');
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Items</h1>
      <ul>
        {items.map(it => <li key={it.id}>{it.name}</li>)}
      </ul>
      <form onSubmit={addItem}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New item name" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
