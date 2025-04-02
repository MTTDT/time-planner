const handleDeleteEvent = async (eventId) => {
  try {
    await api_delete_calendar_event(eventId);
    setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
    setSelectedEvent(null);
    setIsModalOpen(false);
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

<NotesEditor
  notes={selectedEvent?.notes || ''}
  onSave={handleSaveNotes}
  onCancel={() => setIsModalOpen(false)}
  onDelete={() => handleDeleteEvent(selectedEvent?.id)}
  showTitle={false}
/>