import React from 'react';

const TaskCard = ({ task, onDelete, onToggle, onEdit }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center hover:shadow-xl transition duration-300">
      <div>
        <h2
          className={`text-lg font-semibold ${
            task.status === 'completed' ? 'line-through text-gray-400' : ''
          }`}
        >
          {task.title}
        </h2>
        {task.description && <p className="text-gray-500">{task.description}</p>}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onToggle(task._id)}
          className={`px-3 py-1 rounded-md text-white font-medium ${
            task.status === 'completed'
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {task.status === 'completed' ? 'Undo' : 'Done'}
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onDelete(task._id)}
          className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
