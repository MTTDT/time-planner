import jwtDecode from 'jwt-decode';
async function api_checkUsername(username) {
  try {
    const response = await fetch(`http://localhost:8080/app_user/${username}`);
    if(response.ok) return true;
    else return false;
  } catch (error) {
    console.error('Error: ', error );
    throw error;
  }
}

async function api_get_all_calendar_events() {
  try {
      const token = localStorage.getItem('token'); // Get token from storage
      const response = await fetch('http://localhost:8080/calendar_event', {
          headers: {
              'Authorization': `Bearer ${token}` // Include token in header
          }
      });
      
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
  } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
  }
}
export async function api_get_event_partisipants(id) {
  const token = localStorage.getItem('token'); // or however you store the token
  
  const username = getUsernameFromToken(token)
  try{
    const response = await fetch(`http://localhost:8080/calendar_event_p/${id}`);
    console.log("response", response)
    if (!response.ok) throw new Error('Failed to fetch event participants');
    const a = await response.json();
    const b =a.filter(i=>i !== username)
    return b;
  }catch (error) {
      console.error('Error fetching event partisipants:', error);
      throw error;
  }
}
  
//   // Usage:
//   const allEvents = await api_get_all_calendar_events();
//   console.log(allEvents);

const getUsernameFromToken = (token) => {
  if (!token) return null;
  try {
      // Split token into parts and decode the payload (middle part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.id; // Returns the username
  } catch (e) {
      console.error("Failed to decode token", e);
      return null;
  }
}
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
    const token = localStorage.getItem('token'); // Get token from storage

    try {
      const response = await fetch('http://localhost:8080/calendar_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    console.log(updatedData, eventId)
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
// Fetch all todo items
async function api_get_all_todo_items() {
  try {
      const response = await fetch('http://localhost:8080/todo_item');
      if (!response.ok) throw new Error('Failed to fetch todo items');
      return await response.json();
  } catch (error) {
      console.error('Error fetching todo items:', error);
      throw error;
  }
}

// Fetch a specific todo item by ID
async function api_get_todo_item_by_id(id) {
  try {
      const response = await fetch(`http://localhost:8080/todo_item/${id}`);
      if (!response.ok) throw new Error('Todo item not found');
      return await response.json();
  } catch (error) {
      console.error(`Error fetching todo item ${id}:`, error);
      throw error;
  }
}

// Add a new todo item
async function api_add_todo_item({ title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user }) {
  try {
      const response = await fetch('http://localhost:8080/todo_item', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user })
      });
      if (!response.ok) throw new Error('Failed to create todo item');
      return await response.json();
  } catch (error) {
      console.error('Error creating todo item:', error);
      throw error;
  }
}

// Delete a todo item by ID
async function api_delete_todo_item(id) {
  try {
      const response = await fetch(`http://localhost:8080/todo_item/${id}`, {
          method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete todo item');
      return await response.json();
  } catch (error) {
      console.error(`Error deleting todo item ${id}:`, error);
      throw error;
  }
}

async function api_update_todo_item(id, { title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user }) {
  try {
      const response = await fetch(`http://localhost:8080/todo_item/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user })
      });

      if (!response.ok) {
          throw new Error(`Failed to update todo (HTTP ${response.status})`);
      }

      return await response.json();
  } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw error;
  }
}

async function api_get_theme(id) {
  try {
      const response = await fetch(`http://localhost:8080/theme/${id}`);
      
      if (!response.ok) {
          throw new Error(`Failed to fetch theme (HTTP ${response.status})`);
      }

      return await response.json();
  } catch (error) {
      console.error(`Error fetching theme ${id}:`, error);
      throw error;
  }
}

async function api_update_theme(id, { name }) {
  try {
      const response = await fetch(`http://localhost:8080/theme/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name })
      });

      if (!response.ok) {
          throw new Error(`Failed to update theme (HTTP ${response.status})`);
      }

      return await response.json();
  } catch (error) {
      console.error(`Error updating theme ${id}:`, error);
      throw error;
  }
}

export async function api_add_event_member(userId, eventId){
  const token = localStorage.getItem('token')
  try {
    const response = await fetch('http://localhost:8080/event_members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify({ userId, eventId })
    });
    // if(!response.ok) throw console.error("failed to share")
    
    const res = await response.json();
    return res;
} catch (error) {
    console.error('Error creating event member', error);
    //throw error;
}
}

export async function api_delete_event_member(userId){
  const token = localStorage.getItem('token')
  try {
    const response = await fetch('http://localhost:8080/event_members', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify({ userId })
    });
    //if(!response.ok) throw console.error("failed to delete event member")
} catch (error) {
    console.error('Error deleting event member', error);
    throw error;
}
}

export 
{
  api_checkUsername,
  api_get_theme,
  api_update_theme,
  api_add_calendar_event, 
  api_get_calendar_event_by_id, 
  api_get_all_calendar_events, 
  api_update_calendar_event, 
  api_add_todo_item,
  api_delete_todo_item,
  api_get_todo_item_by_id,
  api_get_all_todo_items,
  api_update_todo_item
}