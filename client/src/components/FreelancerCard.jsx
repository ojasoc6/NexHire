import { Link } from 'react-router-dom';

function FreelancerCard({ freelancer }) {
  const { _id, bio, skills, hourlyRate, availability, experienceYears, userId } = freelancer;

  const availabilityColor = {
    available: 'success',
    busy: 'danger',
    'part-time': 'warning'
  };

  return (
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '12px', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold mb-0">{userId?.name || 'Freelancer'}</h5>
          <span className={`badge bg-${availabilityColor[availability]}`}>{availability}</span>
        </div>
        <p className="text-muted small mb-3">{bio || 'No bio yet'}</p>
        <div className="mb-3">
          {skills?.slice(0, 4).map((skill, i) => (
            <span key={i} className="badge me-1 mb-1" style={{ backgroundColor: '#e8f0fe', color: '#0f3460' }}>{skill}</span>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold" style={{ color: '#0f3460' }}>${hourlyRate}/hr</span>
          <span className="text-muted small">{experienceYears} yrs exp</span>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pb-4 px-4">
        <Link to={`/profile/${_id}`} className="btn btn-sm w-100" style={{ backgroundColor: '#0f3460', color: 'white', borderRadius: '8px' }}>
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default FreelancerCard;