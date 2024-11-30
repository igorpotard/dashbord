import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    MenuItem,
    Box,
    Chip,
    IconButton,
    Typography
} from '@mui/material';
import { Plus as AddIcon, Tag as LabelIcon, Delete as DeleteIcon } from 'lucide-react';

const priorities = [
    { value: '1', label: 'Basse' },
    { value: '2', label: 'Moyenne' },
    { value: '3', label: 'Haute' },
    { value: '4', label: 'Très Haute' }
];

function TaskForm({ open, onClose, addTask, editTask, updateTask, labels, onAddLabel, onDeleteLabel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [deadline, setDeadline] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [error, setError] = useState(false);

    // États pour le nouveau label
    const [showNewLabel, setShowNewLabel] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#00ff00');

    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description || '');
            setPriority(editTask.priority || '');
            setDeadline(editTask.deadline || '');
            setSelectedLabels(editTask.labels || []);
        } else {
            setTitle('');
            setDescription('');
            setPriority('');
            setDeadline('');
            setSelectedLabels([]);
        }
    }, [editTask]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (title.trim() === '') {
            setError(true);
            return;
        }

        setError(false);

        const taskData = {
            title,
            description,
            priority,
            deadline,
            labels: selectedLabels
        };

        if (editTask) {
            updateTask({
                ...editTask,
                ...taskData
            });
        } else {
            addTask(taskData);
        }

        // Réinitialiser le formulaire
        setTitle('');
        setDescription('');
        setPriority('');
        setDeadline('');
        setSelectedLabels([]);
        onClose();
    };

    const handleAddNewLabel = () => {
        if (newLabelName.trim()) {
            const newLabel = {
                id: Date.now().toString(),
                name: newLabelName.trim(),
                color: newLabelColor
            };
            onAddLabel(newLabel);
            setSelectedLabels([...selectedLabels, newLabel.id]);
            setNewLabelName('');
            setNewLabelColor('#00ff00');
            setShowNewLabel(false);
        }
    };

    const toggleLabel = (labelId) => {
        setSelectedLabels(prev =>
            prev.includes(labelId)
                ? prev.filter(id => id !== labelId)
                : [...prev, labelId]
        );
    };

    const handleDeleteLabel = (labelId) => {
        onDeleteLabel(labelId);
        setSelectedLabels(prev => prev.filter(id => id !== labelId));
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
                    sx={{ mb: 2 }}
                />

                {/* Section Labels */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Labels
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {labels.map((label) => (
                            <Box key={label.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={label.name}
                                    icon={<LabelIcon className="w-4 h-4" />}
                                    onClick={() => toggleLabel(label.id)}
                                    color={selectedLabels.includes(label.id) ? "primary" : "default"}
                                    sx={{
                                        backgroundColor: selectedLabels.includes(label.id)
                                            ? `${label.color}40`
                                            : 'default',
                                        borderColor: label.color,
                                        '& .MuiChip-icon': {
                                            color: label.color
                                        }
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleDeleteLabel(label.id)}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon className="w-4 h-4" />
                                </IconButton>
                            </Box>
                        ))}
                        <IconButton
                            size="small"
                            onClick={() => setShowNewLabel(true)}
                            sx={{ ml: 1 }}
                        >
                            <AddIcon className="w-4 h-4" />
                        </IconButton>
                    </Box>

                    {/* Formulaire nouveau label */}
                    {showNewLabel && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                            <TextField
                                size="small"
                                label="Nom du label"
                                value={newLabelName}
                                onChange={(e) => setNewLabelName(e.target.value)}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                size="small"
                                type="color"
                                value={newLabelColor}
                                onChange={(e) => setNewLabelColor(e.target.value)}
                                sx={{ width: 80 }}
                            />
                            <Button
                                size="small"
                                onClick={handleAddNewLabel}
                                variant="contained"
                            >
                                Ajouter
                            </Button>
                        </Box>
                    )}
                </Box>
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
