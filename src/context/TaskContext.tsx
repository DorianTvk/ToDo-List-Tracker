import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  startTimeTracking: (taskId: string) => void;
  stopTimeTracking: (taskId: string) => void;
  currentlyTracking: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentlyTracking, setCurrentlyTracking] = useState<string | null>(null);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);

  useEffect(() => {
    // Load tasks from localStorage
    if (user) {
      const storedTasks = localStorage.getItem(`tasks-${user.id}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }
  }, [user]);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    if (user) {
      localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startTimeTracking = (taskId: string) => {
    if (currentlyTracking) {
      // Stop tracking the current task first
      stopTimeTracking(currentlyTracking);
    }
    
    setCurrentlyTracking(taskId);
    setTrackingStartTime(new Date());
  };

  const stopTimeTracking = (taskId: string) => {
    if (currentlyTracking === taskId && trackingStartTime) {
      const now = new Date();
      const durationInMinutes = Math.round(
        (now.getTime() - trackingStartTime.getTime()) / (1000 * 60)
      );
      
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, timeSpent: (task.timeSpent || 0) + durationInMinutes }
            : task
        )
      );
      
      setCurrentlyTracking(null);
      setTrackingStartTime(null);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        startTimeTracking,
        stopTimeTracking,
        currentlyTracking,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};