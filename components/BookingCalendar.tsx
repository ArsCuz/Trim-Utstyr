
import React from 'react';
import { Equipment, Booking } from '../types';
import { getDaysInMonth, isSameDay } from '../utils/dateUtils';

interface BookingCalendarProps {
  currentDate: Date;
  equipment: Equipment[];
  bookings: Booking[];
  onSelectSlot: (equipmentId: string, date: Date) => void;
  onSelectBooking: (booking: Booking) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ currentDate, equipment, bookings, onSelectSlot, onSelectBooking }) => {
  const daysInMonth = getDaysInMonth(currentDate);
  const todayDate = new Date();
  const today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()));
  
  const gridTemplateColumns = `180px repeat(${daysInMonth.length}, minmax(40px, 1fr))`;

  return (
    <div className="bg-brand-surface rounded-lg p-4 flex-grow overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* Header Row */}
        <div 
            className="grid text-center font-semibold text-brand-subtle"
            style={{ gridTemplateColumns }}
        >
          <div className="sticky left-0 bg-brand-surface z-10 p-2 text-left">Equipment</div>
          {daysInMonth.map(day => {
            const isToday = isSameDay(day, today);
            return (
              <div key={day.getTime()} className={`p-2 ${isToday ? 'text-brand-primary' : ''}`}>
                <div className="text-xs">{day.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}</div>
                <div>{day.getUTCDate()}</div>
              </div>
            );
          })}
        </div>
        
        {/* Equipment Rows */}
        <div className="mt-1">
          {equipment.map((item, index) => (
            <div
              key={item.id}
              className={`grid ${index % 2 === 0 ? 'bg-brand-bg/30' : ''}`}
              style={{ gridTemplateColumns, gridAutoRows: 'minmax(3rem, auto)' }}
            >
              {/* 1. Equipment Name */}
              <div className="sticky left-0 bg-brand-surface z-30 p-2 font-medium text-brand-text truncate border-t border-brand-secondary flex items-center row-start-1">
                {item.name}
              </div>
              
              {/* 2. Day Cells for background & click events */}
              {daysInMonth.map((day, dayIndex) => (
                <div
                  key={day.toISOString()}
                  className="border-t border-brand-secondary cursor-pointer hover:bg-brand-primary/20 row-start-1"
                  style={{ gridColumn: dayIndex + 2 }}
                  onClick={() => onSelectSlot(item.id, day)}
                />
              ))}

              {/* 3. Booking Bars - Placed on the same grid */}
              {bookings
                .filter(b => b.equipmentId === item.id)
                .map(booking => {
                  const monthStart = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));
                  const monthEnd = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0));

                  if (booking.endDate < monthStart || booking.startDate > monthEnd) {
                      return null;
                  }

                  const bookingStart = booking.startDate < monthStart ? monthStart : booking.startDate;
                  const bookingEnd = booking.endDate > monthEnd ? monthEnd : booking.endDate;

                  const startDayIndex = daysInMonth.findIndex(day => isSameDay(day, bookingStart));
                  
                  if (startDayIndex === -1) {
                    // This should not happen due to the date clipping logic, but acts as a safeguard.
                    return null;
                  }

                  const gridColumnStart = startDayIndex + 2;

                  const MS_PER_DAY = 1000 * 60 * 60 * 24;
                  const utcStart = Date.UTC(bookingStart.getUTCFullYear(), bookingStart.getUTCMonth(), bookingStart.getUTCDate());
                  const utcEnd = Date.UTC(bookingEnd.getUTCFullYear(), bookingEnd.getUTCMonth(), bookingEnd.getUTCDate());
                  const duration = Math.round((utcEnd - utcStart) / MS_PER_DAY) + 1;

                  if (duration <= 0) return null;

                  return (
                      <div
                          key={booking.id}
                          className="self-center h-8 bg-brand-primary rounded-md px-2 flex items-center text-sm text-white cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap overflow-hidden z-20"
                          style={{
                              gridColumn: `${gridColumnStart} / span ${duration}`,
                              gridRow: 1,
                          }}
                          onClick={() => onSelectBooking(booking)}
                          role="button"
                          aria-label={`Booking for ${booking.userName} from ${bookingStart.toLocaleDateString()} to ${bookingEnd.toLocaleDateString()}`}
                      >
                          <span className="truncate">{booking.userName}</span>
                      </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
