import React from 'react';
import TaskItem from './TaskItem';

function TaskList() {
	// Liste des tâches
	const tasks = [
		{ id: 1, label: 'Travail', importance: 'Haute', description: 'Terminer le rapport' },
		{ id: 2, label: 'Maison', importance: 'Moyenne', description: 'Nettoyer la cuisine' },
	];

	return (
		<div>
			{tasks.map(task => (
				<TaskItem key={task.id} task={task} />
			))}
		</div>
	);
}

export default TaskList;
