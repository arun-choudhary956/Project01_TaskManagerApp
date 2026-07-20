import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
        <span className="task-title">{task.title}</span>
      </div>
      <button className="danger" onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
