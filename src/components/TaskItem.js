import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip, Tooltip } from '@mui/material';
import {
	PriorityHigh,
	LowPriority,
	Warning,
	Error,
	Event,
	Label as LabelIcon,
	CheckCircle,
	PlayArrow,
	ArrowBack,
	DragIndicator,
	Edit
} from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';

const priorityColors = {
    '1': '#4caf50',  // Vert - Basse priorité
    '2': '#ff9800',  // Orange - Moyenne priorité
    '3': '#f57c00',  // Orange foncé - Haute priorité
    '4': '#f44336',  // Rouge - Urgente
};

const priorityLabels = {
    '1': 'Basse priorité',
    '2': 'Moyenne priorité',
    '3': 'Haute priorité',
    '4': 'Urgente',
};

const priorityIcons = {
    '1': <LowPriority sx={{ fontSize: 16 }} />,
    '2': <PriorityHigh sx={{ fontSize: 16 }} />,
    '3': <Warning sx={{ fontSize: 16 }} />,
    '4': <Error sx={{ fontSize: 16 }} />,
};

const statusColors = {
    todo: '#e3f2fd',
    inProgress: '#fff3e0',
    completed: '#e8f5e9'
};

function TaskItem({ task, labels, index, onEdit, onUpdateStatus }) {
	const getFormattedDate = (dateString) => {
		if (!dateString) return null;
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
		});
	};

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                        mb: 1.5,
                        position: 'relative',
                        backgroundColor: statusColors[task.status] || '#fff',
                        transition: 'all 0.2s ease',
                        cursor: 'grab',
                        borderLeft: `8px solid ${priorityColors[task.priority]}`,
                        boxShadow: snapshot.isDragging 
                            ? '0 8px 16px rgba(0,0,0,0.1)' 
                            : '0 2px 4px rgba(0,0,0,0.05)',
                        transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        },
                        '&:active': {
                            cursor: 'grabbing',
                            transform: 'scale(1.02)',
                        }
                    }}
                >
                    <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DragIndicator 
                                sx={{ 
                                    fontSize: 18, 
                                    color: 'text.secondary',
                                    opacity: 0.5,
                                    mr: 0.5
                                }} 
                            />
                            
                            {/* Badge de priorité */}
                            <Chip
                                icon={priorityIcons[task.priority]}
                                label={priorityLabels[task.priority]}
                                size="small"
                                sx={{
                                    height: 24,
                                    backgroundColor: `${priorityColors[task.priority]}15`,
                                    color: priorityColors[task.priority],
                                    borderColor: priorityColors[task.priority],
                                    '& .MuiChip-icon': {
                                        color: priorityColors[task.priority]
                                    },
                                    '& .MuiChip-label': {
                                        px: 1,
                                        fontSize: '0.75rem'
                                    }
                                }}
                            />

                            <Typography 
                                variant="body1" 
                                component="div" 
                                sx={{
                                    fontWeight: 500,
                                    flex: 1,
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                    color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                                }}
                            >
                                {task.title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {task.deadline && (
                                    <Chip
                                        icon={<Event sx={{ fontSize: 14 }} />}
                                        label={getFormattedDate(task.deadline)}
                                        size="small"
                                        sx={{
                                            height: 24,
                                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                                            '& .MuiChip-icon': { fontSize: 14 }
                                        }}
                                    />
                                )}
								{task.labels && task.labels.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {task.labels.map(labelId => {
                                            const label = labels.find(l => l.id === labelId);
                                            if (!label) return null;
                                            return (
                                                <Chip
                                                    key={label.id}
                                                    icon={<LabelIcon sx={{ fontSize: 14 }} />}
                                                    label={label.name}
                                                    size="small"
                                                    sx={{
                                                        height: 24,
                                                        backgroundColor: `${label.color}20`,
                                                        borderColor: label.color,
                                                        '& .MuiChip-icon': {
                                                            color: label.color
                                                        },
                                                        '& .MuiChip-label': {
                                                            px: 1,
                                                            fontSize: '0.75rem'
                                                        }
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}

                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 0.5,
                                    backgroundColor: 'rgba(0,0,0,0.03)',
                                    borderRadius: 1,
                                    padding: '2px'
                                }}>
                                    {task.status !== 'todo' && (
                                        <Tooltip title="Déplacer vers 'À faire'">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUpdateStatus(task.id, 'todo');
                                                }}
                                                sx={{ 
                                                    padding: 0.5,
                                                    backgroundColor: '#e3f2fd',
                                                    '&:hover': { 
                                                        backgroundColor: '#bbdefb',
                                                    }
                                                }}
                                            >
                                                <ArrowBack sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {task.status !== 'inProgress' && (
                                        <Tooltip title="Déplacer vers 'En cours'">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUpdateStatus(task.id, 'inProgress');
                                                }}
                                                sx={{ 
                                                    padding: 0.5,
                                                    backgroundColor: '#fff3e0',
                                                    '&:hover': { 
                                                        backgroundColor: '#ffe0b2',
                                                    }
                                                }}
                                            >
                                                <PlayArrow sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {task.status !== 'completed' && (
                                        <Tooltip title="Marquer comme terminée">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUpdateStatus(task.id, 'completed');
                                                }}
                                                sx={{ 
                                                    padding: 0.5,
                                                    backgroundColor: '#e8f5e9',
                                                    '&:hover': { 
                                                        backgroundColor: '#c8e6c9',
                                                    }
                                                }}
                                            >
                                                <CheckCircle sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    <Tooltip title="Modifier">
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(task);
                                            }}
                                            sx={{ 
                                                padding: 0.5,
                                                '&:hover': { 
                                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                                }
                                            }}
                                        >
                                            <Edit sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>

                        {task.description && (
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                    mt: 0.5,
                                    fontSize: '0.75rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {task.description}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
}

export default TaskItem;
