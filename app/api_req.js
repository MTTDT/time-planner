async function api_get_all_calendar_events() {
    try {
      const response = await fetch('http://localhost:8080/calendar_event');
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
  
//   // Usage:
//   const allEvents = await api_get_all_calendar_events();
//   console.log(allEvents);


  async function api_get_calendar_event_by_id(id) {
    try {
      const response = await fetch(`http://localhost:8080/calendar_event/${id}`);
      if (!response.ok) throw new Error('Event not found');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  }
  
//   // Usage:
//   const event = await api_get_calendar_event_by_id(10); // Replace 10 with your ID
//   console.log(event);


  async function api_add_calendar_event(eventData) {
    try {
      const response = await fetch('http://localhost:8080/calendar_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }
  async function api_update_calendar_event(eventId, updatedData) {
    console.log(updatedData)
    try {
        const response = await fetch(`http://localhost:8080/calendar_event/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update event');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
}
export async function api_delete_calendar_event(eventId) {
  console.log("aaaaaa " + eventId)
  try {
      const response = await fetch(`http://localhost:8080/calendar_event/${eventId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          // Try to get error message, fallback to status text
          let errorMsg = response.statusText;
          try {
              const errorData = await response.json();
              errorMsg = errorData.error || errorMsg;
          } catch (e) {
              console.log('Could not parse error response');
          }
          throw new Error(errorMsg);
      }

      return await response.json();
  } catch (error) {
      console.error('Error deleting event:', error);
      throw error; // Re-throw to allow calling code to handle
  }
}
  // Usage:
//   const newEvent = await api_add_calendar_event({
//     title: 'Meeting',
//     description: 'Team sync',
//     event_date: '2023-12-25',
//     start_time: '09:00',
//     end_time: '10:00',
//   });
//   console.log(newEvent);
export {api_add_calendar_event, api_get_calendar_event_by_id, api_get_all_calendar_events, api_update_calendar_event, api_delete_calendar_event}