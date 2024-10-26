import React from 'react';
import TaskItem from './TaskItem';
import { Grid } from '@mui/material';

function TaskList({ tasks, onEdit }) {
	return (
		<Grid container spacing={3}>
			{tasks.map(task => (
				<TaskItem key={task.id} task={task} onEdit={onEdit} />
			))}
		</Grid>
	);
}

export default TaskList;
