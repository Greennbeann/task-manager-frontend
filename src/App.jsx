import { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [dueDateTime, setDueDateTime] = useState('');

  const updateTaskStatus = (id, newStatus) => {
    fetch(`http://localhost:8080/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStatus.toString()),
    }).then(() => fetchTasks());
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE',
    }).then(() => fetchTasks());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:8080/api/tasks')
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error('Error fetching tasks:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status, dueDateTime }),
    }).then((res) => {
      if (res.ok) {
        setTitle('');
        setDescription('');
        setStatus('TODO');
        setDueDateTime('');
        fetchTasks();
      } else {
        alert('Failed to create task');
      }
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Task Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <input
            required
            type='text'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder='Description (optional)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value='TODO'>TODO</option>
            <option value='IN_PROGRESS'>IN_PROGRESS</option>
            <option value='DONE'>DONE</option>
          </select>
        </div>
        <div>
          <input
            required
            type='datetime-local'
            value={dueDateTime}
            onChange={(e) => setDueDateTime(e.target.value)}
          />
        </div>
        <button type='submit'>Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '1rem' }}>
              <strong>{task.title}</strong> — {task.status}
              <br />
              Due: {task.dueDateTime}
              <br />
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
              >
                <option value='TODO'>TODO</option>
                <option value='IN_PROGRESS'>IN_PROGRESS</option>
                <option value='DONE'>DONE</option>
              </select>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ marginLeft: '1rem' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
