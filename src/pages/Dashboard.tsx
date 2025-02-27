import React from 'react';
import { format } from 'date-fns';
import { Clock, CheckSquare, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useNotes } from '../context/NoteContext';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { notes } = useNotes();
  
  const today = new Date();
  const upcomingTasks = tasks
    .filter(task => !task.completed && new Date(task.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const totalTimeSpent = tasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's an overview of your productivity</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Time Tracked</p>
              <p className="text-xl font-semibold">{formatDuration(totalTimeSpent)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Tasks</p>
              <p className="text-xl font-semibold">{completedTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Tasks</p>
              <p className="text-xl font-semibold">{pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <CalendarIcon size={18} className="mr-2 text-indigo-600" />
              Upcoming Tasks
            </h2>
          </div>
          <div className="p-6">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
            )}
          </div>
        </div>
        
        {/* Recent Notes */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText size={18} className="mr-2 text-indigo-600" />
              Recent Notes
            </h2>
          </div>
          <div className="p-6">
            {recentNotes.length > 0 ? (
              <div className="space-y-4">
                {recentNotes.map(note => (
                  <div key={note.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium">{note.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(note.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No notes yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;