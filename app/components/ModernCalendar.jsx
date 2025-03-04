import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ModernCalendar.css'; // Custom styles

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const ModernCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  const handleWheel = (event) => {
    event.preventDefault();
    const scrollAmount = event.deltaY > 0 ? 1 : -1; // Scroll by months
    const newDate = addMonths(currentDate, scrollAmount);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    const calendarElement = calendarRef.current;
    if (calendarElement) {
      calendarElement.addEventListener('wheel', handleWheel);
      return () => {
        calendarElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, [currentDate]);

  return (
    <div className="modern-calendar-container">
      <div className="modern-calendar" ref={calendarRef}>
        <Calendar
          value={currentDate}
          onChange={(date) => {
            setCurrentDate(date);
            // Reattach the wheel event listener after clicking a day
            const calendarElement = calendarRef.current;
            if (calendarElement) {
              calendarElement.removeEventListener('wheel', handleWheel);
              calendarElement.addEventListener('wheel', handleWheel);
            }
          }}
          tileClassName={({ date, view }) => {
            if (view === 'month' && date.getDay() === 0) {
              return 'highlight';
            }
          }}
        />
      </div>
    </div>
  );
};

export default ModernCalendar;