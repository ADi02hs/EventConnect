import { useState } from 'react';

function CreateEvent({ onEventCreated }) {

  const [event, setEvent] = useState({
    title: '',
    description: '',
    organisationName: '',
    location: '',
    eventDate: '',
    workingHours: '',
    payment: '',
    workersRequired: '',
    posterUrl: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;

    setEvent(previous => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:8080/api/events',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...event,
            payment: Number(event.payment),
            workersRequired: Number(event.workersRequired)
          })
        }
      );

      if (!response.ok) {
        throw new Error('Could not publish event');
      }

      const savedEvent = await response.json();

      setMessage('Event published successfully!');

      setEvent({
        title: '',
        description: '',
        organisationName: '',
        location: '',
        eventDate: '',
        workingHours: '',
        payment: '',
        workersRequired: '',
        posterUrl: ''
      });

      if (onEventCreated) {
        onEventCreated(savedEvent);
      }

    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='create-event-container'>

      <h1>Post a New Event</h1>

      <p>Find people to work at your event.</p>

      <form onSubmit={handleSubmit}>

        <input name="title" placeholder="Event Title"
          value={event.title} onChange={handleChange} required />

        <textarea name="description" placeholder="Event Description"
          value={event.description} onChange={handleChange} required />

        <input name="organisationName" placeholder="Organisation Name"
          value={event.organisationName} onChange={handleChange} required />

        <input name="location" placeholder="Event Location"
          value={event.location} onChange={handleChange} required />

        <label>Event Date</label>
        <input type="date" name="eventDate"
          value={event.eventDate} onChange={handleChange} required />

        <input name="workingHours" placeholder="Working Hours (e.g. 9 AM - 6 PM)"
          value={event.workingHours} onChange={handleChange} required />

        <input type="number" name="payment" placeholder="Payment Amount"
          value={event.payment} onChange={handleChange} required />

        <input type="number" name="workersRequired" placeholder="Workers Required"
          value={event.workersRequired} onChange={handleChange} required />

        <input name="posterUrl" placeholder="Poster Image URL (optional)"
          value={event.posterUrl} onChange={handleChange} />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Publishing...' : 'Publish Event'}
        </button>

      </form>

      {message && <p>{message}</p>}

    </div>
  );
}

export default CreateEvent;