import React, { useState } from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function App() {
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });
    const [open, setOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);

    // Fonction pour ajouter une nouvelle tâche
    const addTask = (title, description, priority, deadline) => {
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            deadline,
            status: 'todo'
        };
        
        setTasks(prev => ({
            ...prev,
            todo: [...prev.todo, newTask]
        }));
        setOpen(false);
    };

    // Fonction pour mettre à jour une tâche existante
    const updateTask = (updatedTask) => {
        const currentStatus = Object.keys(tasks).find(status => 
            tasks[status].some(task => task.id === updatedTask.id)
        );

        if (currentStatus) {
            setTasks(prev => ({
                ...prev,
                [currentStatus]: prev[currentStatus].map(task =>
                    task.id === updatedTask.id ? { ...updatedTask, status: currentStatus } : task
                )
            }));
        }
        setOpen(false);
        setEditTask(null);
    };

    // Fonction pour ouvrir le formulaire d'édition
    const handleEditTask = (task) => {
        setEditTask(task);
        setOpen(true);
    };

    // Fonction pour mettre à jour le statut d'une tâche
    const updateTaskStatus = (taskId, newStatus) => {
        // Trouver la tâche dans toutes les listes
        let taskToMove;
        let sourceList;

        Object.keys(tasks).forEach(status => {
            const task = tasks[status].find(t => t.id === taskId);
            if (task) {
                taskToMove = { ...task, status: newStatus };
                sourceList = status;
            }
        });

        if (taskToMove && sourceList) {
            setTasks(prev => ({
                ...prev,
                [sourceList]: prev[sourceList].filter(t => t.id !== taskId),
                [newStatus]: [...prev[newStatus], taskToMove]
            }));
        }
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceList = tasks[source.droppableId];
        const destList = tasks[destination.droppableId];
        
        if (source.droppableId === destination.droppableId) {
            const reorderedItems = Array.from(sourceList);
            const [removed] = reorderedItems.splice(source.index, 1);
            reorderedItems.splice(destination.index, 0, removed);

            setTasks({
                ...tasks,
                [source.droppableId]: reorderedItems
            });
        } else {
            const sourceItems = Array.from(sourceList);
            const destItems = Array.from(destList);
            const [removed] = sourceItems.splice(source.index, 1);
            
            // Mettre à jour le statut de la tâche
            const updatedTask = { ...removed, status: destination.droppableId };
            destItems.splice(destination.index, 0, updatedTask);

            setTasks({
                ...tasks,
                [source.droppableId]: sourceItems,
                [destination.droppableId]: destItems
            });
        }
    };

    const getColumnTitle = (status) => {
        switch (status) {
            case 'todo': return 'À faire';
            case 'inProgress': return 'En cours';
            case 'completed': return 'Terminées';
            default: return '';
        }
    };

    const getColumnColor = (status) => {
        switch (status) {
            case 'todo': return '#e3f2fd';
            case 'inProgress': return '#fff3e0';
            case 'completed': return '#e8f5e9';
            default: return '#ffffff';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#1976d2'
                    }}
                >
                    Ma Todo List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1,
                        px: 3
                    }}
                >
                    Nouvelle tâche
                </Button>
            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 3,
                    minHeight: '70vh'
                }}>
                    {['todo', 'inProgress', 'completed'].map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <Paper
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        backgroundColor: snapshot.isDraggingOver 
                                            ? '#f5f5f5'
                                            : getColumnColor(status),
                                        borderRadius: 2,
                                        transition: 'background-color 0.2s ease',
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            mb: 3,
                                            fontWeight: 'bold',
                                            color: 'grey.800',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {getColumnTitle(status)}
                                    </Typography>
                                    <TaskList
                                        tasks={tasks[status]}
                                        onEdit={handleEditTask}
                                        onUpdateStatus={updateTaskStatus}
                                    />
                                    {provided.placeholder}
                                </Paper>
                            )}
                        </Droppable>
                    ))}
                </Box>
            </DragDropContext>

            <TaskForm
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditTask(null);
                }}
                addTask={addTask}
                editTask={editTask}
                updateTask={updateTask}
            />
        </Container>
    );
}

export default App;
