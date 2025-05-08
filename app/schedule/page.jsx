"use client"
import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/plugins/Sidebar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from 'date-fns/locale/en-US';

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const generateRecurringEvents = (schedule) => {
  const events = [];
  const startDate = startOfWeek(new Date());
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 6);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayName = format(currentDate, 'EEEE');
    const daySchedule = schedule.daySchedules.find(ds => ds.day === dayName);
    
    if (daySchedule) {
      const weekNumber = Math.floor((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000));
      const isScheduledWeek = daySchedule.frequency === 'weekly' || 
                           (daySchedule.frequency === 'biweekly' && weekNumber % 2 === 0);

      if (isScheduledWeek) {
        const [startHour, startMinute] = daySchedule.startTime.split(':');
        const [endHour, endMinute] = daySchedule.endTime.split(':');
        
        const eventStart = new Date(currentDate);
        eventStart.setHours(parseInt(startHour), parseInt(startMinute));
        
        const eventEnd = new Date(currentDate);
        // Handle overnight events
        if (parseInt(endHour) < parseInt(startHour) || 
           (parseInt(endHour) === parseInt(startHour) && parseInt(endMinute) <= parseInt(startMinute))) {
          eventEnd.setDate(eventEnd.getDate() + 1); // Move to next day
        }
        eventEnd.setHours(parseInt(endHour), parseInt(endMinute));

        events.push({
          id: `${schedule.id}-${dayName}-${Math.random()}`,
          title: schedule.title,
          description: schedule.description,
          start: eventStart,
          end: eventEnd,
        });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return events;
};

const SchedulePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]); // Store class definitions
  const [events, setEvents] = useState([]); // Store generated calendar events
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    id: null,
    title: '',
    description: '',
    daySchedules: []
  });
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const handleCreateClass = (classData) => {
    const newClassWithId = {
      ...classData,
      id: Date.now()
    };
    
    setClasses(prevClasses => [...prevClasses, newClassWithId]);
    const newEvents = generateRecurringEvents(newClassWithId);
    setEvents(prevEvents => [...prevEvents, ...newEvents]);
    setIsModalOpen(false);
  };

  const handleSaveSchedule = () => {
    if (editingSchedule) {
      // Update the classes list
      setClasses(prevClasses => 
        prevClasses.map(c => c.id === editingSchedule.id ? newSchedule : c)
      );

      // Remove all old events for this class
      setEvents(prevEvents => 
        prevEvents.filter(event => !event.id.toString().includes(editingSchedule.id))
      );

      // Generate and add new events
      const updatedEvents = generateRecurringEvents({
        ...newSchedule,
        id: editingSchedule.id // Ensure we use the same ID
      });
      setEvents(prevEvents => [...prevEvents, ...updatedEvents]);
    } else {
      // Handle new class creation
      const newClassWithId = {
        ...newSchedule,
        id: Date.now()
      };
      setClasses(prevClasses => [...prevClasses, newClassWithId]);
      const newEvents = generateRecurringEvents(newClassWithId);
      setEvents(prevEvents => [...prevEvents, ...newEvents]);
    }

    // Reset form state
    setIsModalOpen(false);
    setNewSchedule({
      id: null,
      title: '',
      description: '',
      daySchedules: []
    });
    setEditingSchedule(null);
  };

  const handleAddDaySchedule = () => {
    setNewSchedule(prev => ({
      ...prev,
      daySchedules: [
        ...prev.daySchedules,
        { day: '', startTime: '', endTime: '', frequency: 'weekly' }
      ]
    }));
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      if (confirm('Are you sure you want to delete this class?')) {
        // First remove from UI
        setClasses(prevClasses => prevClasses.filter(c => c.id !== scheduleId));
        
        // Remove all associated events from calendar
        setEvents(prevEvents => prevEvents.filter(event => !event.id.toString().includes(scheduleId)));
        
        // Then delete from backend
        await api_delete_calendar_event(scheduleId);
        
        setIsListModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      // Optionally show error to user
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onToggle={setIsSidebarOpen} />
      <div className={`flex-1 m-2 transition-all duration-300 ${isSidebarOpen ? 'md:pl-48 pl-25' : 'md:pl-16 pl-8'}`}>
        <div className="">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <h1 className="text-2xl font-bold">Class Schedule</h1>
            <div className="space-x-4">
              <button
                onClick={() => setIsListModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                View All Classes
              </button>
              <button
                onClick={() => {
                  setEditingSchedule(null);
                  setNewSchedule({
                    id: null,
                    title: '',
                    description: '',
                    daySchedules: []
                  });
                  setIsModalOpen(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Class
              </button>
            </div>
          </div>
          <div className='md:text-lg text-[10px] sm:text-[15px]'>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={['week']}
            className="bg-white p-4 rounded-lg shadow h-[700px]"
            style={{ 
              height: 700,
              maxWidth: "100vw",
          }}
          />
  </div>
          {/* View All Classes Modal */}
          {isListModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">All Classes</h2>
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{classItem.title}</h3>
                          <p className="text-sm text-gray-600">{classItem.description}</p>
                          <div className="mt-2">
                            {classItem.daySchedules.map((ds, index) => (
                              <p key={index} className="text-sm text-gray-500">
                                {ds.day}: {ds.startTime}-{ds.endTime} ({ds.frequency})
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              setEditingSchedule(classItem);
                              setNewSchedule(classItem);
                              setIsModalOpen(true);
                              setIsListModalOpen(false);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(classItem.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsListModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Class Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingSchedule ? 'Edit Class' : 'Add New Class'}
                </h2>
                
                <input
                  type="text"
                  placeholder="Class Name"
                  className="w-full mb-4 p-2 border rounded"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                />
                
                <textarea
                  placeholder="Description"
                  className="w-full mb-4 p-2 border rounded"
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                />

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Class Times</h3>
                    <button
                      onClick={handleAddDaySchedule}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Add Day Schedule
                    </button>
                  </div>
                  
                  {newSchedule.daySchedules.map((daySchedule, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center bg-gray-50 p-2 rounded">
                      <select
                        className="border rounded p-2"
                        value={daySchedule.day}
                        onChange={(e) => {
                          const updatedSchedules = [...newSchedule.daySchedules];
                          updatedSchedules[index] = {
                            ...daySchedule,
                            day: e.target.value
                          };
                          setNewSchedule({...newSchedule, daySchedules: updatedSchedules});
                        }}
                      >
                        <option value="">Select day</option>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                          .map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))
                        }
                      </select>

                      <input
                        type="time"
                        className="border rounded p-2"
                        value={daySchedule.startTime}
                        onChange={(e) => {
                          const updatedSchedules = [...newSchedule.daySchedules];
                          updatedSchedules[index] = {
                            ...daySchedule,
                            startTime: e.target.value
                          };
                          setNewSchedule({...newSchedule, daySchedules: updatedSchedules});
                        }}
                      />

                      <input
                        type="time"
                        className="border rounded p-2"
                        value={daySchedule.endTime}
                        onChange={(e) => {
                          const updatedSchedules = [...newSchedule.daySchedules];
                          updatedSchedules[index] = {
                            ...daySchedule,
                            endTime: e.target.value
                          };
                          setNewSchedule({...newSchedule, daySchedules: updatedSchedules});
                        }}
                      />

                      <select
                        className="border rounded p-2"
                        value={daySchedule.frequency}
                        onChange={(e) => {
                          const updatedSchedules = [...newSchedule.daySchedules];
                          updatedSchedules[index] = {
                            ...daySchedule,
                            frequency: e.target.value
                          };
                          setNewSchedule({...newSchedule, daySchedules: updatedSchedules});
                        }}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                      </select>

                      <button
                        onClick={() => {
                          const updatedSchedules = newSchedule.daySchedules.filter((_, i) => i !== index);
                          setNewSchedule({...newSchedule, daySchedules: updatedSchedules});
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSchedule(null);
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSchedule}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {editingSchedule ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;