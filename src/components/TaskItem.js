import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';
import { 
    PriorityHigh, 
    LowPriority, 
    Warning, 
    Error, 
    Event, 
    CheckCircle, 
    PlayArrow, 
    ArrowBack,
    DragIndicator
} from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';

const priorityColors = {
    '1': '#4caf50', // Vert pour basse priorité
    '2': '#ff9800', // Orange pour moyenne priorité
    '3': '#f57c00', // Orange foncé pour haute priorité
    '4': '#f44336', // Rouge pour très haute priorité
};

const priorityIcons = {
    '1': <LowPriority sx={{ fontSize: 20 }} />,
    '2': <PriorityHigh sx={{ fontSize: 20 }} />,
    '3': <Warning sx={{ fontSize: 20 }} />,
    '4': <Error sx={{ fontSize: 20 }} />,
};

const statusColors = {
    todo: '#e3f2fd',
    inProgress: '#fff3e0',
    completed: '#e8f5e9'
};

function TaskItem({ task, index, onEdit, onUpdateStatus }) {
    const getFormattedDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                        mb: 2,
                        position: 'relative',
                        backgroundColor: statusColors[task.status] || '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 3,
                        },
                        opacity: snapshot.isDragging ? 0.9 : 1,
                    }}
                >
                    <Box
                        {...provided.dragHandleProps}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: -20,
                            transform: 'translateY(-50%)',
                            cursor: 'grab',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.3,
                            '&:hover': { opacity: 1 }
                        }}
                    >
                        <DragIndicator />
                    </Box>

                    <CardContent sx={{ pb: '16px !important' }}>
                        <Box onClick={() => onEdit(task)} sx={{ cursor: 'pointer' }}>
                            <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{
                                    mb: 1,
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                    color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                                }}
                            >
                                {task.title}
                            </Typography>

                            {task.description && (
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ mb: 2 }}
                                >
                                    {task.description}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Chip
                                    icon={priorityIcons[task.priority]}
                                    label={`Priorité ${task.priority}`}
                                    size="small"
                                    sx={{
                                        backgroundColor: `${priorityColors[task.priority]}15`,
                                        color: priorityColors[task.priority],
                                        '& .MuiChip-icon': {
                                            color: priorityColors[task.priority]
                                        }
                                    }}
                                />

                                {task.deadline && (
                                    <Chip
                                        icon={<Event sx={{ fontSize: 20 }} />}
                                        label={getFormattedDate(task.deadline)}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            '& .MuiChip-icon': {
                                                color: '#757575'
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>

                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end',
                                gap: 1
                            }}
                        >
                            {task.status !== 'todo' && (
                                <IconButton
                                    size="small"
                                    onClick={() => onUpdateStatus(task.id, 'todo')}
                                    sx={{
                                        backgroundColor: '#e3f2fd',
                                        '&:hover': { backgroundColor: '#bbdefb' }
                                    }}
                                >
                                    <ArrowBack sx={{ fontSize: 20 }} />
                                </IconButton>
                            )}

                            {task.status !== 'inProgress' && (
                                <IconButton
                                    size="small"
                                    onClick={() => onUpdateStatus(task.id, 'inProgress')}
                                    sx={{
                                        backgroundColor: '#fff3e0',
                                        '&:hover': { backgroundColor: '#ffe0b2' }
                                    }}
                                >
                                    <PlayArrow sx={{ fontSize: 20 }} />
                                </IconButton>
                            )}

                            {task.status !== 'completed' && (
                                <IconButton
                                    size="small"
                                    onClick={() => onUpdateStatus(task.id, 'completed')}
                                    sx={{
                                        backgroundColor: '#e8f5e9',
                                        '&:hover': { backgroundColor: '#c8e6c9' }
                                    }}
                                >
                                    <CheckCircle sx={{ fontSize: 20 }} />
                                </IconButton>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
}

export default TaskItem;
