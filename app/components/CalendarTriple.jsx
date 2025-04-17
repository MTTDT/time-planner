"use client";
import { format, getDay, parse, startOfWeek, setHours, setMinutes } from "date-fns";
import React, { useEffect, useState, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enUS from 'date-fns/locale/en-US';
import "../globals.css";
import NotesEditor from './NotesEditor';
import { api_get_calendar_event_by_id, api_add_calendar_event, api_get_all_calendar_events, api_update_calendar_event, api_delete_calendar_event } from "../api_req";
import { title } from "process";

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
const formats = {
    timeGutterFormat: 'HH:mm', // Time on the left side (e.g., "08:00", "13:00")
    eventTimeRangeFormat: ({ start, end }) => 
      `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`, // Event time display
    agendaTimeFormat: 'HH:mm', // Agenda view time format
    agendaTimeRangeFormat: ({ start, end }) => 
      `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
  };

function CalendarTriple() {
    const [newEvent, setNewEvent] = useState({ 
        id:-1,
        description:"",
        title: "", 
        start: null, 
        end: null,
        notes: ""
    });

    const [allEvents, setAllEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({
        id:-1,
        description:"",
        title: "",
        start: null,
        end: null,
        notes: ""
    });
    const [isNotesEditorOpen, setIsNotesEditorOpen] = useState(false);

    useEffect(() => {
        async function fetchAllEvents() {
            try {
                const dbEvents = await api_get_all_calendar_events();
                const calendarEvents = convertDbEventsToCalendarEvents(dbEvents);
                setAllEvents(calendarEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
        fetchAllEvents();
    }, []);

    function convertDbEventsToCalendarEvents(dbEvents) {
        if (!Array.isArray(dbEvents)) {
            dbEvents = [dbEvents];
        }
      
        return dbEvents.map(dbEvent => {
            const eventDate = new Date(dbEvent.event_date);
            const startTimeParts = dbEvent.start_time.split(':').map(Number);
            const endTimeParts = dbEvent.end_time.split(':').map(Number);

            const start = new Date(eventDate);
            start.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2]);

            const end = new Date(eventDate);
            end.setHours(endTimeParts[0], endTimeParts[1], endTimeParts[2]);

            return {
                id: dbEvent.id,
                title: dbEvent.title,
                notes: dbEvent.description || "", 
                start: start,
                end: end
            };
        });
    }

    const handleSelectSlot = ({ start }) => {
        const currentHour = new Date().getHours();
        const selectedStart = setHours(setMinutes(new Date(start), 0), currentHour);
        const selectedEnd = setHours(setMinutes(new Date(start), 0), currentHour + 1);
        
        setSelectedDate(new Date(start));
        setNewEvent({
            ...newEvent,
            start: selectedStart,
            end: selectedEnd
        });
    };
    const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        }, []);

    const TimeInput = ({ selected, onChange }) => {
        const [hours, setHours] = useState(selected ? selected.getHours() : 0)
        const [minutes, setMinutes] = useState(selected ? selected.getMinutes() : 0)
        const hourInputRef = useRef(null)
        const minuteInputRef = useRef(null)
        const [activeInput, setActiveInput] = useState(null)
      
        // Track which input was active before re-render
        useEffect(() => {
          if (activeInput === "hour" && hourInputRef.current) {
            hourInputRef.current.focus()
          } else if (activeInput === "minute" && minuteInputRef.current) {
            minuteInputRef.current.focus()
          }
        }, [hours, minutes, activeInput])
      
        const handleHourChange = (e) => {
          const val = Math.min(23, Math.max(0, Number.parseInt(e.target.value) || 0))
          setHours(val)
            updateTime(val, minutes)
        }
      
        const handleMinuteChange = (e) => {
          const val = Math.min(59, Math.max(0, Number.parseInt(e.target.value) || 0))
          setMinutes(val)
          setActiveInput("minute")
          updateTime(hours, val)
        }
      
        const updateTime = (newHours, newMinutes) => {
          // Use the selected date as base if available, otherwise use current date
          const baseDate = selected || new Date()
          const newTime = new Date(baseDate)
          newTime.setHours(newHours)
          newTime.setMinutes(newMinutes)
          newTime.setSeconds(0)
          newTime.setMilliseconds(0)
      
          onChange(newTime)
        }
      
        return (
          <div className="flex items-center space-x-2">
            <input
            
              type="number"
              min="0"
              max="23"
              value={hours.toString().padStart(2, "0")}
              onChange={handleHourChange}
              onFocus={() => setActiveInput("hour")}
              placeholder="HH"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              ref={hourInputRef}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes.toString().padStart(2, "0")}
              onChange={handleMinuteChange}
              onFocus={() => setActiveInput("minute")}
              placeholder="MM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              ref={minuteInputRef}
            />
          </div>
        )
      }
      const handleStartTimeChange = (time) => {
        if (!time) return;
        
        const newStart = new Date(selectedDate);
        newStart.setHours(time.getHours());
        newStart.setMinutes(time.getMinutes());
        
        const newEnd = new Date(newStart);
        newEnd.setHours(newStart.getHours() + 1);
        
        setNewEvent({
          ...newEvent,
          start: newStart,
          end: newEnd
        });
      };

    const handleEndTimeChange = (time) => {
        if (!time) return;
        
        const newEnd = new Date(selectedDate);
        newEnd.setHours(time.getHours());
        newEnd.setMinutes(time.getMinutes());
        
        setNewEvent({
            ...newEvent,
            end: newEnd
        });
    };
    function convertCalendarEventToDbEvent(calendarEvent) {
        // Extract date components
        const startDate = new Date(calendarEvent.start);
        const endDate = new Date(calendarEvent.end);
      
        // Format as database expects
        return {
          id: calendarEvent.id || null, // Include ID if exists (for updates)
          title: calendarEvent.title,
          description: calendarEvent.notes || "", // Map notes back to description
          event_date: startDate.toISOString().split('T')[0], // YYYY-MM-DD
          start_time: formatTime(startDate), // HH:MM:SS
          end_time: formatTime(endDate)     // HH:MM:SS
        };
      }
      
      // Helper function to format time as HH:MM:SS
      function formatTime(date) {
        return [
          date.getHours().toString().padStart(2, '0'),
          date.getMinutes().toString().padStart(2, '0'),
          date.getSeconds().toString().padStart(2, '0')
        ].join(':');
      }

    async function handleAddEvent() {
        if (!newEvent.title || !newEvent.start || !newEvent.end) {
            alert("Please fill in all fields");
            return;
        }

        setAllEvents([...allEvents, newEvent]);
        await api_add_calendar_event(convertCalendarEventToDbEvent(newEvent))
        setNewEvent({ title: "", start: "", end: "", notes: "", description: "" });
    }

    const handleEventDoubleClick = (event) => {
        console.log(event)
        setEditingEvent(event);
        setEditForm({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            notes: event.notes || "",
            description: event.description || "",
        });
    };

    const handleEditSubmit = async() => {
        if (!editForm.title || !editForm.start || !editForm.end) {
            alert("Please fill in all fields");
            return;
        }
       
        setAllEvents(allEvents.map(event => 
            event === editingEvent 
                ? { ...editForm }
                : event
        ));
        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setEditingEvent(null);
        setEditForm({
            id:-1,
            description:"",
            title: "",
            start: null,
            end: null,
            notes: ""
        });
    };

    const handleDeleteEvent = async() => {
        console.log(editingEvent)
        setAllEvents(allEvents.filter(event => event !== editingEvent));
        api_delete_calendar_event(editingEvent.id)
        handleCancelEdit();
    };

    const handleOpenNotesEditor = () => {
        setIsNotesEditorOpen(true);
    };

    const handleSaveNotes = async(notes) => {
        const dbEvent = convertCalendarEventToDbEvent(editingEvent)
        // await api_update_calendar_event(dbEvent.id,
        //     {
        //         title:dbEvent.title, 
        //         description:JSON.stringify(notes),
        //         event_date:dbEvent.event_date,
        //         start_time:dbEvent.start_time,
        //         end_time: dbEvent.end_time
        //     })
        setEditForm({ ...editForm, notes });
        setIsNotesEditorOpen(false);
    };

    const handleCancelNotes = () => {
        setIsNotesEditorOpen(false);
    };

    const handleDeleteNotes = () => {
        setEditForm({ ...editForm, notes: "" });
        setIsNotesEditorOpen(false);
    };

    const dayPropGetter = (date) => {
        if (selectedDate && 
            date.getDate() === selectedDate.getDate() && 
            date.getMonth() === selectedDate.getMonth() && 
            date.getFullYear() === selectedDate.getFullYear()
        ) {
            return {
                className: 'selected-day',
                style: {
                    border: '2px solid #3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }
            };
        }
        return {};
    };

    const CustomToolbar = (props) => {
        const formattedLabel = props.label 
    ? props.label.split(' ')[0].substring(0, 3) + ' ' + props.label.split(' ').slice(1).join(' ')
    : props.label;

        return (
        <div className={`flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-center`}>            {/* Left Group: Today Button */}
            <div className="flex">
              <button 
                type="button" 
                onClick={() => props.onNavigate("TODAY")} 
                className="border rounded-xl px-4 py-1 m-1 hover:bg-gray-500 text-xl hover:bg-opacity-30"
              >
                Today
              </button>
            </div>
      
            {/* Center Group: Back, Date Label, Next */}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => props.onNavigate("PREV")} className="border rounded-md px-2 hover:bg-gray-500 hover:bg-opacity-30">
                {"<"}
              </button>
              <span className="rbc-toolbar-label mx-2 font-medium">
                {formattedLabel}
              </span>
              <button type="button" onClick={() => props.onNavigate("NEXT")} className="border rounded-md px-2 hover:bg-gray-500 hover:bg-opacity-30">
                {">"}
              </button>
            </div>
      
            {/* Right Group: Day, Week, Month Views */}
            <div className="flex gap-4 border py-1 px-4 mr-2 rounded-xl ">
              <button
                type="button"
                onClick={() => props.onView("day")}
                className={`${props.view === "day" ? "bg-gray-500 bg-opacity-10" : ""} hover:bg-gray-500 hover:bg-opacity-30 rounded-xl px-3 py-1`}
                
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => props.onView("week")}
                className={`${props.view === "week" ? "bg-gray-500 bg-opacity-10" : ""} hover:bg-gray-500 hover:bg-opacity-30 rounded-xl px-3 py-1`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => props.onView("month")}
                className={`${props.view === "month" ? "bg-gray-500 bg-opacity-10" : ""} hover:bg-gray-500 hover:bg-opacity-30 rounded-xl px-3 py-1`}
              >
                Month
              </button>
            </div>
          </div>
        );
      };

    return (
        <div >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left sidebar - Event form */}
                    <div className="w-full md:w-80 rounded-xl shadow-md p-6 h-fit">
                        <h1 className="text-2xl font-bold mb-6">Calendar</h1>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium  mb-1">Event Title</label>
                                <input 
                                    type="text" 
                                    placeholder="Add title" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    value={newEvent.title} 
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Time</label>
                                <TimeInput 
                                    selected={newEvent.start} 
                                    onChange={handleStartTimeChange} 
                                />
                            </div>
                            
                            
                                {newEvent.start ? (
                                    <div>
                                        <label className="block text-sm font-medium  mb-1">End Time</label>
                                    <TimeInput 
                                        selected={newEvent.end} 
                                        onChange={handleEndTimeChange} 
                                    />
                                </div>
                                ):(<></>)}
                                
                            
                            <button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                onClick={handleAddEvent}
                            >
                                Add Event
                            </button>
                        </div>
                    </div>
                    
                    {/* Main calendar area */}
                    <div className="flex-1">
                        <div className="overflow-hidden md:text-lg text-[10px] sm:text-[15px]">
                            
                            <Calendar 
                                localizer={localizer} 
                                events={allEvents} 
                                startAccessor="start" 
                                endAccessor="end" 
                                style={{ 
                                    height: 700,
                                    maxWidth: "100vw",
                                }}
                                defaultView="week"
                                views={['month', 'week', 'day']}
                                components={{
                                    toolbar: CustomToolbar, // Use your custom toolbar
                                  }}
                                selectable={true}
                                onSelectSlot={handleSelectSlot}
                                selected={selectedDate}
                                dayPropGetter={dayPropGetter}
                                onDoubleClickEvent={handleEventDoubleClick}
                                formats={formats}
                                eventPropGetter={(event) => ({
                                    style: {
                                        
                                        background: '#70bcd4',
                                        borderRadius: '4px',
                                        border: 'none',
                                        color: 'white',
                                        padding: '2px 8px',
                                        display: 'block',
                                        
                                    }
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Event Modal */}
            {editingEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Event</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="Event Title" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        value={editForm.title} 
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <TimeInput 
                                        selected={editForm.start} 
                                        onChange={(date) => setEditForm({ ...editForm, start: date })} 
                                    />
                                   
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <TimeInput 
                                        selected={editForm.end} 
                                        onChange={(date) => setEditForm({ ...editForm, end: date })} 
                                    />
                                     
                                </div>
                                
                                <button
                                    onClick={handleOpenNotesEditor}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    {editForm.notes ? "Edit Notes" : "Add Notes"}
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={handleDeleteEvent}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Notes Editor Modal */}
            {isNotesEditorOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                        <NotesEditor
                            notes={editForm.notes}
                            onSave={handleSaveNotes}
                            onCancel={handleCancelNotes}
                            onDelete={handleDeleteNotes}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarTriple;