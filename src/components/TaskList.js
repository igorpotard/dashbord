import React from 'react';
import TaskItem from './TaskItem';
import { Box } from '@mui/material';

function TaskList({ tasks, onEdit, onUpdateStatus }) {
	return (
		<Box sx={{ px: 1 }}>
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
