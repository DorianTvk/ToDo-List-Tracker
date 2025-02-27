import React from 'react';
import { format } from 'date-fns';
import { Play, Pause, Edit, Trash, CheckSquare, Square } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStartTracking: () => void;
  onStopTracking: () => void;
  isTracking: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onStartTracking,
  onStopTracking,
  isTracking,
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`p-4 border rounded-lg mb-3 ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button onClick={onToggleComplete} className="mt-1">
            {task.completed ? (
              <CheckSquare className="text-green-500" size={20} />
            ) : (
              <Square className="text-gray-400" size={20} />
            )}
          </button>
          <div>
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-gray-500 flex items-center">
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
              {task.location && (
                <span className="text-xs text-gray-500 flex items-center">
                  Location: {task.location}
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                Time: {formatDuration(task.timeSpent || 0)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {isTracking ? (
            <button
              onClick={onStopTracking}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Stop tracking"
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              onClick={onStartTracking}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Start tracking"
              disabled={task.completed}
            >
              <Play size={18} />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit task"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete task"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;