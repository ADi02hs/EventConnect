import { useState, useEffect } from 'react';

function OrganiserDashboard() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = () => {
    fetch('http://localhost:8080/api/applications/event/1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not load applications');
        }
        return response.json();
      })
      .then(data => {
        setApplications(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(applicationId, status) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/applications/${applicationId}/status?status=${status}`,
        {
          method: 'PUT'
        }
      );

      if (!response.ok) {
        throw new Error('Could not update application status');
      }

      const updatedApplication = await response.json();

      setApplications(previous =>
        previous.map(application =>
          application.id === applicationId
            ? updatedApplication
            : application
        )
      );

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div style={{ padding: '40px' }}>

      <h1>Organiser Dashboard</h1>

      <h2>Bengaluru Music Festival</h2>

      <h3>Candidate Applications ({applications.length})</h3>

      {loading && <p>Loading applicants...</p>}

      {error && <p>{error}</p>}

      {!loading && applications.length === 0 && (
        <p>No candidates have applied yet.</p>
      )}

      {applications.map(application => (

        <div
          key={application.id}
          style={{
            background: 'white',
            border: '1px solid #ddd',
            padding: '25px',
            marginBottom: '20px',
            borderRadius: '10px'
          }}
        >

          <h2>{application.candidate.fullName}</h2>

          <p>Email: {application.candidate.email}</p>

          <p>Phone: {application.candidate.phone}</p>

          <p>Skills: {application.candidate.skills}</p>

          <p>
            Resume:{' '}
            {application.candidate.resumeUrl ? (
              <a
                href={application.candidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            ) : (
              'Not provided'
            )}
          </p>

          <p>
            Application Status: <strong>{application.status}</strong>
          </p>

          {application.status === 'PENDING' && (

            <div style={{ display: 'flex', gap: '10px' }}>

              <button
                onClick={() => updateStatus(application.id, 'ACCEPTED')}
                style={{ background: 'green' }}
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(application.id, 'REJECTED')}
                style={{ background: 'red' }}
              >
                Reject
              </button>

            </div>

          )}

        </div>

      ))}

    </div>
  );
}

export default OrganiserDashboard;