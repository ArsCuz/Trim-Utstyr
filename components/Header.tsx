
import React from 'react';
import { getMonthName } from '../utils/dateUtils';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNewBooking: () => void;
}

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onNewBooking }) => {
  return (
    <header className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-text mb-2 sm:mb-0">Trim Media Equipment</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewBooking}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
        >
          New Booking
        </button>
        <div className="flex items-center bg-brand-surface rounded-lg p-1">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-md hover:bg-brand-secondary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon />
          </button>
          <span className="w-40 text-center text-lg font-semibold">{getMonthName(currentDate)}</span>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-md hover:bg-brand-secondary transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
