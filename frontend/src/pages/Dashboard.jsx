import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/API';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tasks');
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add or update task
  const addOrUpdateTask = async (task) => {
    try {
      if (editingTask) {
        const res = await API.put(`/tasks/${editingTask._id}`, task);
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        setEditingTask(null); // reset form
      } else {
        const res = await API.post('/tasks', task);
        setTasks((prevTasks) => [res.data, ...prevTasks]);
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError(editingTask ? 'Failed to update task' : 'Failed to add task');
    }
  };


  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await API.patch(`/tasks/${id}/toggle`);
      if (res.data?._id) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === id ? res.data : t))
        );
        setError('');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600 font-semibold text-lg">
        Loading tasks...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Task Manager</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-medium transition duration-300"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">My Tasks</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        
        <TaskForm
          onSubmit={addOrUpdateTask}
          existingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

       
        {tasks?.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            No tasks yet. Add one above to get started!
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleTask}
                onEdit={(task) => setEditingTask(task)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
