import { useState } from 'react';
import { Calendar } from '@heroui/react';
import { parseDate } from '@internationalized/date';
import '../globals.css';

export default function DayView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const nextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const previousDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleCalendarSelect = (selectedDate) => {
    const newDate = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
    setCurrentDate(newDate);
    setShowCalendar(false);
  };

  // Format the date for the Calendar component using parseDate
  const formattedCalendarValue = parseDate(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
  );

  const formattedDate = {
    monthYear: currentDate.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    }),
    dayWeekday: currentDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric'
    })
  };

  return (
    <div className="day-view">
      <div className="day-header">
        <button onClick={previousDay} className="nav-btn">
          &lt;
        </button>
        <div className="date-display">
          <button 
            className="date-selector"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div className="month-year">
              {formattedDate.monthYear}
            </div>
            <div className="weekday-day">
              {formattedDate.dayWeekday}
            </div>
          </button>
          {showCalendar && (
            <div className="calendar-popup">
              <Calendar 
                aria-label="Select Date"
                value={formattedCalendarValue}
                onChange={handleCalendarSelect}
                className="calendar-widget"
              />
            </div>
          )}
        </div>
        <button onClick={nextDay} className="nav-btn">
          &gt;
        </button>
      </div>
      <div className="time-grid">
        {hours.map(hour => (
          <div key={hour} className="time-slot">
            <div className="time-label">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            <div className="event-space">
              {/* Events will go here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}