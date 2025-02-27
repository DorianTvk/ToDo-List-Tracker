import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface CalendarProps {
  tasks: Task[];
  onSelectDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onSelectDate(day);
  };

  const hasTasksOnDate = (date: Date) => {
    return tasks.some(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map(day => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const hasTasks = hasTasksOnDate(day);

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`
                h-10 rounded-full flex items-center justify-center text-sm
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
                ${hasTasks && !isSelected ? 'font-bold text-indigo-600' : ''}
              `}
            >
              {format(day, 'd')}
              {hasTasks && !isSelected && (
                <span className="absolute w-1 h-1 bg-indigo-600 rounded-full bottom-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;