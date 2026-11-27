import { useState, useEffect } from 'react';
import './App.css';
import OrganiserDashboard from './OrganiserDashbord';
import CreateEvent from './CreateEvent';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showOrganiserDashboard, setShowOrganiserDashboard] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [applicationError, setApplicationError] = useState('');

  const [candidate, setCandidate] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
    resumeUrl: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  function fetchEvents() {
    fetch('http://localhost:8080/api/events')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        return response.json();
      })
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }

  function goHome() {
    setShowOrganiserDashboard(false);
    setShowCreateEvent(false);
    setSelectedEvent(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setCandidate(previous => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleApplicationSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setApplicationError('');
    setSuccess('');

    try {
      const candidateResponse = await fetch(
        'http://localhost:8080/api/candidates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(candidate)
        }
      );

      if (!candidateResponse.ok) {
        throw new Error('Could not save candidate profile');
      }

      const savedCandidate = await candidateResponse.json();

      const params = new URLSearchParams({
        eventId: String(selectedEvent.id),
        candidateId: String(savedCandidate.id)
      });

      const applicationResponse = await fetch(
        `http://localhost:8080/api/applications?${params.toString()}`,
        {
          method: 'POST'
        }
      );

      if (!applicationResponse.ok) {
        throw new Error('Could not submit application');
      }

      await applicationResponse.json();

      setSuccess('Your application has been submitted successfully!');

      setCandidate({
        fullName: '',
        email: '',
        phone: '',
        skills: '',
        resumeUrl: ''
      });

      setShowApplicationForm(false);

    } catch (error) {
      setApplicationError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEventCreated(newEvent) {
    setEvents(previous => [...previous, newEvent]);
    setShowCreateEvent(false);
    setShowOrganiserDashboard(false);
    setSelectedEvent(null);
    window.scrollTo(0, 0);
  }

  return (
    <div>

      <nav className="navbar">
        <h2>EventConnect</h2>

        <div className="nav-links">
          <a href="#" onClick={goHome}>Home</a>

          <a href="#events" onClick={goHome}>
            Explore Events
          </a>

          <a href="#organisers" onClick={goHome}>
            For Organisers
          </a>
        </div>

        <button onClick={() => {
          setShowCreateEvent(true);
          setShowOrganiserDashboard(false);
          setSelectedEvent(null);
        }}>
          Post an Event
        </button>
      </nav>

      {showOrganiserDashboard ? (

        <div>
          <button
            style={{ margin: '25px' }}
            onClick={() => setShowOrganiserDashboard(false)}
          >
             Back to Home
          </button>

          <OrganiserDashboard />
        </div>

      ) : showCreateEvent ? (

        <div>
          <button
            style={{ margin: '25px' }}
            onClick={() => setShowCreateEvent(false)}
          >
             Back to Home
          </button>

          <CreateEvent onEventCreated={handleEventCreated} />
        </div>

      ) : (

        <>

          <section className="hero">
            <h1>
              Find Work Opportunities
              <br />
              at Amazing Events
            </h1>

            <p>
              Discover event jobs, connect with organisers
              and find opportunities near you.
            </p>
          </section>

          <section className="events" id="events">

            {selectedEvent ? (

              <div className="event-details">

                <button onClick={() => {
                  setSelectedEvent(null);
                  setShowApplicationForm(false);
                  setSuccess('');
                  setApplicationError('');
                }}>
                  ← Back to Events
                </button>

                <h2>{selectedEvent.title}</h2>

                <p>{selectedEvent.description}</p>

                <h3>Organisation Details</h3>
                <p>{selectedEvent.organisationName}</p>

                <h3>Event Information</h3>

                <p>Location: {selectedEvent.location}</p>
                <p>Date: {selectedEvent.eventDate}</p>
                <p>Working Hours: {selectedEvent.workingHours}</p>
                <p>Payment: ₹{selectedEvent.payment}</p>
                <p>Workers Required: {selectedEvent.workersRequired}</p>

                {success && (
                  <p style={{ color: 'green' }}>{success}</p>
                )}

                {applicationError && (
                  <p style={{ color: 'red' }}>{applicationError}</p>
                )}

                {!showApplicationForm && (
                  <button onClick={() => {
                    setShowApplicationForm(true);
                    setSuccess('');
                    setApplicationError('');
                  }}>
                    Apply for this Event
                  </button>
                )}

                {showApplicationForm && (

                  <div className="application-form">

                    <h3>Candidate Application Form</h3>

                    <form onSubmit={handleApplicationSubmit}>

                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={candidate.fullName}
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={candidate.email}
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={candidate.phone}
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="text"
                        name="skills"
                        placeholder="Your Skills"
                        value={candidate.skills}
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="url"
                        name="resumeUrl"
                        placeholder="Resume URL (optional)"
                        value={candidate.resumeUrl}
                        onChange={handleChange}
                      />

                      <button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowApplicationForm(false)}
                      >
                        Cancel
                      </button>

                    </form>

                  </div>
                )}

              </div>

            ) : (

              <>
                <h2>Available Events</h2>

                <p>Explore real opportunities from event organisers.</p>

                {loading && <p>Loading events...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && events.length === 0 && (
                  <p>No events available right now.</p>
                )}

                <div className="event-grid">

                  {events.map(event => (

                    <div className="event-card" key={event.id}>

                      <h3>{event.title}</h3>
                      <p>{event.description}</p>

                      <p>
                        <strong>Organisation:</strong> {event.organisationName}
                      </p>

                      <p>
                        <strong>Location:</strong> {event.location}
                      </p>

                      <p>
                        <strong>Date:</strong> {event.eventDate}
                      </p>

                      <p>
                        <strong>Working Hours:</strong> {event.workingHours}
                      </p>

                      <p>
                        <strong>Payment:</strong> ₹{event.payment}
                      </p>

                      <p>
                        <strong>Workers Required:</strong> {event.workersRequired}
                      </p>

                      <button onClick={() => setSelectedEvent(event)}>
                        View Details
                      </button>

                    </div>

                  ))}

                </div>
              </>

            )}

          </section>

          <section className="organiser" id="organisers">

            <h2>Organising an Event?</h2>

            <p>
              Find talented people to make your event successful.
            </p>

            <button onClick={() => {
              setShowCreateEvent(true);
              setSelectedEvent(null);
            }}>
              Post Your Event
            </button>

            <button
              style={{ marginLeft: '10px' }}
              onClick={() => setShowOrganiserDashboard(true)}
            >
              Organiser Dashboard
            </button>

          </section>

        </>
      )}

    </div>
  );
}

export default App;