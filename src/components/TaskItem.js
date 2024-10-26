import React from 'react';

function TaskItem({ task }) {
	return (
		<div>
			<h2>{task.label}</h2>
			<p>Importance: {task.importance}</p>
			<p>{task.description}</p>
		</div>
	);
}

export default TaskItem;
