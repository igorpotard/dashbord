import React from 'react';
import TaskItem from './TaskItem';
import { Box } from '@mui/material';

function TaskList({ tasks, onEdit, onUpdateStatus }) {
	if (!Array.isArray(tasks)) {
		console.warn('Tasks is not an array:', tasks);
		return null;
	}

	return (
		<Box sx={{
			minHeight: 5,
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			gap: 2
		}}>
			{tasks.map((task, index) => (
				<TaskItem
					key={task.id}
					task={task}
					index={index}
					onEdit={onEdit}
					onUpdateStatus={onUpdateStatus}
				/>
			))}
		</Box>
	);
}

export default TaskList;
