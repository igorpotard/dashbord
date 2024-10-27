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
    DragIndicator,
    Edit
} from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';

const priorityColors = {
    '1': '#4caf50',
    '2': '#ff9800',
    '3': '#f57c00',
    '4': '#f44336',
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

    console.log('TaskItem rendering:', { taskId: task.id, index }); // Debug log

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => {
                console.log('Draggable state:', { 
                    isDragging: snapshot.isDragging, 
                    taskId: task.id 
                }); // Debug log
                
                return (
                    <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                            mb: 2,
                            position: 'relative',
                            backgroundColor: statusColors[task.status] || '#fff',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            border: snapshot.isDragging ? '3px solid red' : '1px solid transparent',
                            boxShadow: snapshot.isDragging ? '0 0 10px rgba(255,0,0,0.5)' : 'none',
                            transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3,
                            },
                            '&:active': {
                                transform: 'scale(1.02)',
                                border: '3px solid red',
                            }
                        }}
                    >
                        <div
                            {...provided.dragHandleProps}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                cursor: 'move',
                            }}
                        />

                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: -20,
                                transform: 'translateY(-50%)',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: 0.3,
                                '&:hover': { opacity: 1 }
                            }}
                        >
                            <DragIndicator />
                        </Box>

                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography 
                                    variant="h6" 
                                    component="div" 
                                    sx={{
                                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                        color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                                        pointerEvents: 'none' // Important pour le drag
                                    }}
                                >
                                    {task.title}
                                </Typography>
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(task);
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Box>

                            {task.description && (
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ mb: 2, pointerEvents: 'none' }} // Important pour le drag
                                >
                                    {task.description}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pointerEvents: 'none' }}>
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

                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                    position: 'relative',
                                    zIndex: 2
                                }}
                                onClick={e => e.stopPropagation()} // Pour que les boutons fonctionnent
                            >
                                {task.status !== 'todo' && (
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateStatus(task.id, 'todo');
                                        }}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateStatus(task.id, 'inProgress');
                                        }}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateStatus(task.id, 'completed');
                                        }}
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
                );
            }}
        </Draggable>
    );
}

export default TaskItem;
