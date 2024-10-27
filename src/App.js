import React, { useState, useEffect } from 'react';
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
	const [labels, setLabels] = useState([]);
	const [open, setOpen] = useState(false);
	const [editTask, setEditTask] = useState(null);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // Si on déplace dans la même colonne
        if (source.droppableId === destination.droppableId) {
            const column = tasks[source.droppableId];
            const newTasks = Array.from(column);
            const [removed] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, removed);

            setTasks({
                ...tasks,
                [source.droppableId]: newTasks
            });
        } else {
            // Si on déplace dans une autre colonne
            const sourceColumn = tasks[source.droppableId];
            const destColumn = tasks[destination.droppableId];
            const sourceTasks = Array.from(sourceColumn);
            const destTasks = Array.from(destColumn);
            const [removed] = sourceTasks.splice(source.index, 1);
            
            // Mise à jour du statut de la tâche
            const updatedTask = {
                ...removed,
                status: destination.droppableId
            };
            
            destTasks.splice(destination.index, 0, updatedTask);

            setTasks({
                ...tasks,
                [source.droppableId]: sourceTasks,
                [destination.droppableId]: destTasks
            });
        }
    };

	// Charger les labels depuis localStorage au démarrage
	useEffect(() => {
		const savedLabels = localStorage.getItem('labels');
		if (savedLabels) {
			setLabels(JSON.parse(savedLabels));
		}
	}, []);
	// Sauvegarder les labels dans localStorage quand ils changent
	useEffect(() => {
		localStorage.setItem('labels', JSON.stringify(labels));
	}, [labels]);

	// Fonction pour ajouter un nouveau label
	const addLabel = (newLabel) => {
		setLabels(prev => [...prev, newLabel]);
	};

		const addTask = (taskData) => {
				const newTask = {
						id: Date.now().toString(),
						...taskData,
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
                <Typography variant="h4" component="h1">
                    Ma Todo List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
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
                    {Object.keys(tasks).map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <Paper
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        backgroundColor: snapshot.isDraggingOver 
                                            ? '#f5f5f5'
                                            : getColumnColor(status),
                                        minHeight: 200,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        {getColumnTitle(status)}
                                    </Typography>
                                    
                                    <TaskList
                                        tasks={tasks[status]}
                                        labels={labels}
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
                labels={labels}
                onAddLabel={addLabel}
            />
        </Container>
    );
}

export default App;
