"use client";
import { format, getDay, parse, startOfWeek, setHours, setMinutes } from "date-fns";
import React, { useEffect, useState } from "react";
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
        setNewEvent({ title: "", start: "", end: "", notes: "" });
    }

    const handleEventDoubleClick = (event) => {
        setEditingEvent(event);
        setEditForm({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            notes: event.notes || ""
        });
    };

    const handleEditSubmit = () => {
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
        await api_update_calendar_event(dbEvent.id,
            {
                title:dbEvent.title, 
                description:JSON.stringify(notes),
                event_date:dbEvent.event_date,
                start_time:dbEvent.start_time,
                end_time: dbEvent.end_time
            })
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left sidebar - Event form */}
                    <div className="w-full md:w-80 bg-white rounded-xl shadow-md p-6 h-fit">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Calendar</h1>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input 
                                    type="text" 
                                    placeholder="Meeting with team" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    value={newEvent.title} 
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <DatePicker
                                    selected={newEvent.start}
                                    onChange={handleStartTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    placeholderText="Select start time"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <DatePicker
                                    selected={newEvent.end}
                                    onChange={handleEndTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    placeholderText="Select end time"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    minTime={newEvent.start}
                                    maxTime={setHours(new Date(), 23)}
                                />
                            </div>
                            
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
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <Calendar 
                                localizer={localizer} 
                                events={allEvents} 
                                startAccessor="start" 
                                endAccessor="end" 
                                style={{ height: 700 }}
                                defaultView="week"
                                views={['month', 'week', 'day']}
                                selectable={true}
                                onSelectSlot={handleSelectSlot}
                                selected={selectedDate}
                                dayPropGetter={dayPropGetter}
                                onDoubleClickEvent={handleEventDoubleClick}
                                eventPropGetter={(event) => ({
                                    style: {
                                        backgroundColor: '#3b82f6',
                                        borderRadius: '4px',
                                        border: 'none',
                                        color: 'white',
                                        padding: '2px 8px'
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
                                    <DatePicker
                                        selected={editForm.start}
                                        onChange={(date) => setEditForm({ ...editForm, start: date })}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="h:mm aa"
                                        placeholderText="Start Time"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <DatePicker
                                        selected={editForm.end}
                                        onChange={(date) => setEditForm({ ...editForm, end: date })}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="h:mm aa"
                                        placeholderText="End Time"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        minTime={editForm.start}
                                        maxTime={setHours(new Date(), 23)}
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

jest.mock('../app/api_req', () => ({
    api_get_all_calendar_events: jest.fn(),
    api_add_calendar_event: jest.fn(),
    api_update_calendar_event: jest.fn(),
    api_delete_calendar_event: jest.fn(),
}));

describe('Integration Tests for CalendarTriple', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the calendar and event form', () => {
        render(<CalendarTriple />);
        expect(screen.getByText('Calendar')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Meeting with team')).toBeInTheDocument();
        expect(screen.getByText('Add Event')).toBeInTheDocument();
    });

    test('fetches and displays events from the API', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Team Meeting',
                event_date: '2025-04-03',
                start_time: '10:00:00',
                end_time: '11:00:00',
                description: 'Discuss project updates',
            },
        ];
        api.api_get_all_calendar_events.mockResolvedValue(mockEvents);

        await act(async () => {
            render(<CalendarTriple />);
        });

        expect(api.api_get_all_calendar_events).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    });

    test('adds a new event', async () => {
        render(<CalendarTriple />);

        fireEvent.change(screen.getByPlaceholderText('Meeting with team'), {
            target: { value: 'New Event' },
        });

        fireEvent.click(screen.getByText('Add Event'));

        expect(api.api_add_calendar_event).toHaveBeenCalledTimes(1);
        expect(api.api_add_calendar_event).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'New Event',
            })
        );
    });

    test('does not add an event with missing fields', () => {
        render(<CalendarTriple />);

        fireEvent.click(screen.getByText('Add Event'));

        expect(api.api_add_calendar_event).not.toHaveBeenCalled();
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    test('opens the edit modal on double-clicking an event', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Team Meeting',
                event_date: '2025-04-03',
                start_time: '10:00:00',
                end_time: '11:00:00',
                description: 'Discuss project updates',
            },
        ];
        api.api_get_all_calendar_events.mockResolvedValue(mockEvents);

        await act(async () => {
            render(<CalendarTriple />);
        });

        const event = screen.getByText('Team Meeting');
        fireEvent.doubleClick(event);

        expect(screen.getByText('Edit Event')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Team Meeting')).toBeInTheDocument();
    });

    test('edits an event and saves changes', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Team Meeting',
                event_date: '2025-04-03',
                start_time: '10:00:00',
                end_time: '11:00:00',
                description: 'Discuss project updates',
            },
        ];
        api.api_get_all_calendar_events.mockResolvedValue(mockEvents);

        await act(async () => {
            render(<CalendarTriple />);
        });

        const event = screen.getByText('Team Meeting');
        fireEvent.doubleClick(event);

        const titleInput = screen.getByPlaceholderText('Event Title');
        fireEvent.change(titleInput, { target: { value: 'Updated Meeting' } });

        fireEvent.click(screen.getByText('Save Changes'));

        expect(api.api_update_calendar_event).toHaveBeenCalledTimes(1);
        expect(api.api_update_calendar_event).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                title: 'Updated Meeting',
            })
        );
    });

    test('deletes an event', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Team Meeting',
                event_date: '2025-04-03',
                start_time: '10:00:00',
                end_time: '11:00:00',
                description: 'Discuss project updates',
            },
        ];
        api.api_get_all_calendar_events.mockResolvedValue(mockEvents);

        await act(async () => {
            render(<CalendarTriple />);
        });

        const event = screen.getByText('Team Meeting');
        fireEvent.doubleClick(event);

        fireEvent.click(screen.getByText('Delete'));

        expect(api.api_delete_calendar_event).toHaveBeenCalledTimes(1);
        expect(api.api_delete_calendar_event).toHaveBeenCalledWith(1);
    });

    test('opens the notes editor', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Team Meeting',
                event_date: '2025-04-03',
                start_time: '10:00:00',
                end_time: '11:00:00',
                description: 'Discuss project updates',
            },
        ];
        api.api_get_all_calendar_events.mockResolvedValue(mockEvents);

        await act(async () => {
            render(<CalendarTriple />);
        });

        const event = screen.getByText('Team Meeting');
        fireEvent.doubleClick(event);

        fireEvent.click(screen.getByText('Add Notes'));

        expect(screen.getByText('Notes Editor')).toBeInTheDocument();
    });

    test('saves notes for an event', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Team Meeting',
                event_date: '2025-04-03',
                start_time: '10:00:00',
                end_time: '11:00:00',
                description: 'Discuss project updates',
            },
        ];
        api.api_get_all_calendar_events.mockResolvedValue(mockEvents);

        await act(async () => {
            render(<CalendarTriple />);
        });

        const event = screen.getByText('Team Meeting');
        fireEvent.doubleClick(event);

        fireEvent.click(screen.getByText('Add Notes'));

        const notesEditor = screen.getByText('Notes Editor');
        fireEvent.change(notesEditor, { target: { value: 'New Notes' } });

        fireEvent.click(screen.getByText('Save'));

        expect(api.api_update_calendar_event).toHaveBeenCalledTimes(1);
        expect(api.api_update_calendar_event).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                description: 'New Notes',
            })
        );
    });

    test('deletes notes for an event', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Team Meeting',
                event_date: '2025-04-03',
                start_time: '10:00:00',
                end_time: '11:00:00',
                description: 'Discuss project updates',
            },
        ];
        api.api_get_all_calendar_events.mockResolvedValue(mockEvents);

        await act(async () => {
            render(<CalendarTriple />);
        });

        const event = screen.getByText('Team Meeting');
        fireEvent.doubleClick(event);

        fireEvent.click(screen.getByText('Add Notes'));

        fireEvent.click(screen.getByText('Delete Notes'));

        expect(api.api_update_calendar_event).toHaveBeenCalledTimes(1);
        expect(api.api_update_calendar_event).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                description: '',
            })
        );
    });
});