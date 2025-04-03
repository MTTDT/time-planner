import {
    api_get_all_calendar_events,
    api_get_calendar_event_by_id,
    api_add_calendar_event,
    api_update_calendar_event,
    api_delete_calendar_event,
    api_get_all_todo_items,
    api_get_todo_item_by_id,
    api_add_todo_item,
    api_delete_todo_item,
    api_update_todo_item
  } from '../app/api_req';
  
  global.fetch = jest.fn();
  
  describe('Calendar Events API', () => {
    beforeEach(() => {
      fetch.mockClear();
    });
  
    const mockEvent = { id: 1, title: 'Test Event', start: '2023-01-01' };
    const mockTodo = { id: 1, title: 'Test Todo', is_checked: false };
  
    test('fetches all calendar events successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockEvent],
      });
  
      const events = await api_get_all_calendar_events();
      expect(events).toEqual([mockEvent]);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/calendar_event');
    });
  
    test('throws error when fetching all events fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });
  
      await expect(api_get_all_calendar_events()).rejects.toThrow('Failed to fetch events');
    });
  
    test('fetches single calendar event by id', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      });
  
      const event = await api_get_calendar_event_by_id(1);
      expect(event).toEqual(mockEvent);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/calendar_event/1');
    });
  
    test('throws error when event not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });
  
      await expect(api_get_calendar_event_by_id(999)).rejects.toThrow('Event not found');
    });
  
    test('adds new calendar event', async () => {
      const newEvent = { title: 'New Event' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...newEvent, id: 2 }),
      });
  
      const result = await api_add_calendar_event(newEvent);
      expect(result).toEqual({ ...newEvent, id: 2 });
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/calendar_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
    });
  
    test('updates calendar event', async () => {
      const updatedEvent = { ...mockEvent, title: 'Updated' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedEvent,
      });
  
      const result = await api_update_calendar_event(1, updatedEvent);
      expect(result).toEqual(updatedEvent);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/calendar_event/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
    });
  
    test('deletes calendar event', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Deleted' }),
      });
  
      const result = await api_delete_calendar_event(1);
      expect(result).toEqual({ message: 'Deleted' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/calendar_event/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
  
  describe('Todo Items API', () => {
    beforeEach(() => {
      fetch.mockClear();
    });
  
    const mockTodo = { id: 1, title: 'Test Todo', is_checked: false };
  
    test('fetches all todo items successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTodo],
      });
  
      const todos = await api_get_all_todo_items();
      expect(todos).toEqual([mockTodo]);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/todo_item');
    });
  
    test('fetches single todo item by id', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo,
      });
  
      const todo = await api_get_todo_item_by_id(1);
      expect(todo).toEqual(mockTodo);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/todo_item/1');
    });
  
    test('adds new todo item', async () => {
      const newTodo = { title: 'New Todo' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...newTodo, id: 2 }),
      });
  
      const result = await api_add_todo_item(newTodo);
      expect(result).toEqual({ ...newTodo, id: 2 });
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/todo_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
    });
  
    
  
    test('deletes todo item', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Deleted' }),
      });
  
      const result = await api_delete_todo_item(1);
      expect(result).toEqual({ message: 'Deleted' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/todo_item/1', {
        method: 'DELETE',
      });
    });
  });