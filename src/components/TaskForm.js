import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    TextField, 
    Button, 
    MenuItem 
} from '@mui/material';

const priorities = [
    { value: '1', label: 'Basse' },
    { value: '2', label: 'Moyenne' },
    { value: '3', label: 'Haute' },
    { value: '4', label: 'Très Haute' }
];

function TaskForm({ open, onClose, addTask, editTask, updateTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description || '');
            setPriority(editTask.priority || '');
            setDeadline(editTask.deadline || '');
        } else {
            setTitle('');
            setDescription('');
            setPriority('');
            setDeadline('');
        }
    }, [editTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (title.trim() === '') {
            setError(true);
            return;
        }
        
        setError(false);
        
        if (editTask) {
            updateTask({
                ...editTask,
                title,
                description,
                priority,
                deadline
            });
        } else {
            addTask(title, description, priority, deadline);
        }

        // Réinitialiser le formulaire
        setTitle('');
        setDescription('');
        setPriority('');
        setDeadline('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editTask ? "Modifier la tâche" : "Créer une tâche"}
            </DialogTitle>
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
                    sx={{ mb: 2 }}
                />
                <TextField 
                    margin="dense" 
                    label="Description" 
                    fullWidth 
                    multiline
                    rows={4}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    sx={{ mb: 2 }}
                />
                <TextField
                    select
                    margin="dense"
                    label="Priorité"
                    fullWidth
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    sx={{ mb: 2 }}
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
                <Button onClick={onClose} color="primary">
                    Annuler
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    {editTask ? "Mettre à jour" : "Ajouter"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TaskForm;
