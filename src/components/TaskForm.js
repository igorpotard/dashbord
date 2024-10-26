import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem } from '@mui/material';

const priorities = [
  { value: '1', label: 'Basse' },
  { value: '2', label: 'Moyenne' },
  { value: '3', label: 'Haute' },
  { value: '4', label: 'Très Haute' }
];

function TaskForm({ open, onClose, addTask, editTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setPriority(editTask.priority);
      setDeadline(editTask.deadline);
    }
  }, [editTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      setError(true);
      return;
    }
    setError(false);
    addTask(title, description, priority, deadline);
    setTitle('');
    setDescription('');
    setPriority('');
    setDeadline('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editTask ? "Éditer la tâche" : "Créer une tâche"}</DialogTitle>
      <DialogContent>
        <TextField 
          autoFocus 
          margin="dense" 
          label="Titre de la tâche" 
          fullWidth 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          error={error}
          helperText={error ? "Le titre est requis" : ""}
        />
        <TextField 
          margin="dense" 
          label="Description" 
          fullWidth 
          multiline
          rows={4}
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <TextField
          select
          margin="dense"
          label="Priorité"
          fullWidth
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Date Limite"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary">{editTask ? "Mettre à jour" : "Ajouter"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskForm;

