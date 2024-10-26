import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const addTask = (title, description, priority, deadline) => {
    if (editTask) {
      setTasks(tasks.map(task => task.id === editTask.id ? { ...task, title, description, priority, deadline } : task));
      setEditTask(null);
    } else {
      const newTask = { id: tasks.length + 1, title, description, priority, deadline };
      setTasks([...tasks, newTask]);
    }
    setOpen(false);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setOpen(true);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Ma Todo List</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Créer une tâche</Button>
      <TaskForm open={open} onClose={() => { setOpen(false); setEditTask(null); }} addTask={addTask} editTask={editTask} />
      <TaskList tasks={tasks} onEdit={handleEditTask} />
    </Container>
  );
}

export default App;
