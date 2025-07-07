
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  description: string;
  aim: string;
  benefit: string;
  audience: string[];
  target: string[];
  tone: string;
  platforms: string[];
  status: string;
  approved?: boolean;
  media_url: string;
  date: string;
  special?: boolean;
  post_links?: {
    [key: string]: string;
  };
}

interface CalendarViewProps {
  posts: Post[];
  onDateClick: (date: string, posts: Post[]) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ posts, onDateClick, currentDate, onDateChange }) => {
  const today = new Date();
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPostsForDate = (date: string) => {
    return posts.filter(post => post.date === date);
  };

  const getPostsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthString = `${year}-${String(month).padStart(2, '0')}`;
    return posts.filter(post => post.date.startsWith(monthString));
  };

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const postsInMonth = getPostsForMonth();

  const renderCalendarDay = (day: number) => {
    const dateString = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
    const postsForDay = getPostsForDate(dateString);
    const isToday = today.getDate() === day && 
                   today.getMonth() === currentDate.getMonth() && 
                   today.getFullYear() === currentDate.getFullYear();
    const hasPosts = postsForDay.length > 0;
    const hasSpecialPost = postsForDay.some(post => post.special);
    
    // Check if this day is a Sunday (0 = Sunday)
    const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
    const isSunday = dayOfWeek === 0;

    return (
      <button
        key={day}
        onClick={() => hasPosts && onDateClick(dateString, postsForDay)}
        className={`
          aspect-square p-2 rounded-lg text-sm font-medium transition-all duration-200 relative
          ${isToday ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-gray-100'}
          ${hasPosts ? 'cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300' : 'cursor-default'}
          ${!hasPosts && !isToday && !isSunday ? 'text-gray-400' : ''}
          ${isSunday && !isToday ? 'text-red-500' : ''}
          ${hasSpecialPost ? 'ring-2 ring-yellow-300 ring-offset-1' : ''}
        `}
      >
        <span className={`${isToday ? 'font-bold' : ''} ${isSunday && !isToday ? 'text-red-500 font-semibold' : ''}`}>
          {day}
        </span>
        
        {/* Special Day Badge */}
        {hasSpecialPost && (
          <div className="absolute top-1 right-1">
            <Star className={`w-3 h-3 ${isToday ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-500 fill-yellow-500'}`} />
          </div>
        )}
        
        {hasPosts && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-0.5">
              {postsForDay.slice(0, 3).map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    isToday ? 'bg-white' : 'bg-blue-500'
                  }`}
                />
              ))}
              {postsForDay.length > 3 && (
                <div className={`text-xs ${isToday ? 'text-white' : 'text-blue-600'}`}>
                  +{postsForDay.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">{monthName}</h2>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            {postsInMonth.length} posts
          </span>
        </div>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className={`text-center text-xs md:text-sm font-medium py-2 ${
            index === 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => 
          renderCalendarDay(index + 1)
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>Has posts</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>Special day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
