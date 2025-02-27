import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import Calendar from '../components/Calendar';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';

const CalendarView: React.FC = () => {
  const { tasks, toggleTaskCompletion, updateTask, deleteTask, startTimeTracking, stopTimeTracking, currentlyTracking } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const tasksForSelectedDate = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isSameDay(taskDate, selectedDate);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar tasks={tasks} onSelectDate={handleDateSelect} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            
            <div className="space-y-4">
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={() => toggleTaskCompletion(task.id)}
                    onEdit={() => {/* Handle edit */}}
                    onDelete={() => deleteTask(task.id)}
                    onStartTracking={() => startTimeTracking(task.id)}
                    onStopTracking={() => stopTimeTracking(task.id)}
                    isTracking={currentlyTracking === task.id}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No tasks for this date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;