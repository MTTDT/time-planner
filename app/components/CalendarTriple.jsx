"use client";

import { format, getDay, parse, startOfWeek, setHours, setMinutes } from "date-fns";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enUS from 'date-fns/locale/en-US';
import "../globals.css";

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

const events = [];

function CalendarTriple() {
    const [newEvent, setNewEvent] = useState({ 
        title: "", 
        start: null, 
        end: null 
    });
    const [allEvents, setAllEvents] = useState(events);
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        start: null,
        end: null
    });

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
        
        // Preserve the selected date, only update the time
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
        
        // Preserve the selected date, only update the time
        const newEnd = new Date(selectedDate);
        newEnd.setHours(time.getHours());
        newEnd.setMinutes(time.getMinutes());
        
        setNewEvent({
            ...newEvent,
            end: newEnd
        });
    };

    function handleAddEvent() {
        if (!newEvent.title || !newEvent.start || !newEvent.end) {
            alert("Please fill in all fields");
            return;
        }

        // Check for time clash
        // for (let i = 0; i < allEvents.length; i++) {
        //     const d1 = new Date(allEvents[i].start);
        //     const d2 = new Date(newEvent.start);
        //     const d3 = new Date(allEvents[i].end);
        //     const d4 = new Date(newEvent.end);
            
        //     if (((d1 <= d2) && (d2 <= d3)) || ((d1 <= d4) && (d4 <= d3))) {
        //         alert("Time slot is already booked!");
        //         return;
        //     }
        // }
        
        setAllEvents([...allEvents, newEvent]);
        setNewEvent({ title: "", start: "", end: "" }); // Reset form
    }

    const handleEventDoubleClick = (event) => {
        setEditingEvent(event);
        setEditForm({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end)
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
            title: "",
            start: null,
            end: null
        });
    };

    const handleDeleteEvent = () => {
        setAllEvents(allEvents.filter(event => event !== editingEvent));
        handleCancelEdit();
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
                    border: '2px solid #0070f3',
                    backgroundColor: 'rgba(0, 112, 243, 0.1)'
                }
            };
        }
        return {};
    };

    return (
        <div className="App">
            <h1>Calendar</h1>
            <div className="event-form">
                <input 
                    type="text" 
                    placeholder="Add Title" 
                    className="event-input"
                    value={newEvent.title} 
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                />
                <DatePicker
                    selected={newEvent.start}
                    onChange={handleStartTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    placeholderText="Start Time"
                    className="event-input"
                />
                <DatePicker
                    selected={newEvent.end}
                    onChange={handleEndTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    placeholderText="End Time"
                    className="event-input"
                    minTime={newEvent.start}
                    maxTime={setHours(new Date(), 23)}
                />
                <button 
                    className="add-button"
                    onClick={handleAddEvent}
                >
                    Add Event
                </button>
            </div>
            <Calendar 
                localizer={localizer} 
                events={allEvents} 
                startAccessor="start" 
                endAccessor="end" 
                style={{ height: 500, margin: "50px" }}
                defaultView="week"
                views={['month', 'week', 'day']}
                selectable={true}
                onSelectSlot={handleSelectSlot}
                selected={selectedDate}
                dayPropGetter={dayPropGetter}
                onDoubleClickEvent={handleEventDoubleClick}
            />
            {editingEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Event</h2>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Event Title" 
                                className="event-input"
                                value={editForm.title} 
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                            />
                            <DatePicker
                                selected={editForm.start}
                                onChange={(date) => setEditForm({ ...editForm, start: date })}
                                showTimeSelect
                                showTimeSelectOnly
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                placeholderText="Start Time"
                                className="event-input"
                            />
                            <DatePicker
                                selected={editForm.end}
                                onChange={(date) => setEditForm({ ...editForm, end: date })}
                                showTimeSelect
                                showTimeSelectOnly
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                placeholderText="End Time"
                                className="event-input"
                                minTime={editForm.start}
                                maxTime={setHours(new Date(), 23)}
                            />
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={handleDeleteEvent}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarTriple;