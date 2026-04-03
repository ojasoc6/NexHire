import { Link } from 'react-router-dom';

function FreelancerCard({ freelancer }) {
  const { _id, bio, skills, hourlyRate, availability, experienceYears, userId } = freelancer;

  const availabilityConfig = {
    available: { color: '#198754', bg: '#e8f5e9', label: '● Available' },
    busy: { color: '#dc3545', bg: '#fce4ec', label: '● Busy' },
    'part-time': { color: '#fd7e14', bg: '#fff3e0', label: '● Part Time' }
  };

  const avail = availabilityConfig[availability] || availabilityConfig['available'];

  return (
    <div className="h-100 card-hover" style={{
      background: 'white', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'all 0.3s ease'
    }}>
      {/* Top accent bar */}
      <div style={{ height: 4, background: 'linear-gradient(135deg, #0f3460, #e94560)' }} />

      <div className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center fw-bold text-white"
              style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #0f3460, #16213e)', fontSize: '1.2rem' }}>
              {userId?.name?.charAt(0) || 'F'}
            </div>
            <div>
              <h6 className="fw-bold mb-0">{userId?.name || 'Freelancer'}</h6>
              <small className="text-muted">{experienceYears} yrs experience</small>
            </div>
          </div>
          <span className="small fw-bold px-2 py-1 rounded-pill"
            style={{ backgroundColor: avail.bg, color: avail.color, fontSize: '11px' }}>
            {avail.label}
          </span>
        </div>

        {/* Bio */}
        <p className="text-muted small mb-3" style={{ lineHeight: 1.5, minHeight: '40px' }}>
          {bio?.length > 80 ? bio.substring(0, 80) + '...' : bio || 'No bio provided'}
        </p>

        {/* Skills */}
        <div className="mb-3">
          {skills?.slice(0, 3).map((skill, i) => (
            <span key={i} className="skill-pill">{skill}</span>
          ))}
          {skills?.length > 3 && (
            <span className="small text-muted ms-1">+{skills.length - 3} more</span>
          )}
        </div>

        {/* Rate */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="fw-bold fs-5" style={{ color: '#0f3460' }}>${hourlyRate}</span>
            <span className="text-muted small">/hr</span>
          </div>
          <div className="text-end">
            <div className="small text-muted">Portfolio</div>
            <div className="fw-bold small" style={{ color: '#0f3460' }}>
              {freelancer.portfolio?.length || 0} projects
            </div>
          </div>
        </div>

        {/* Button */}
        <Link to={`/profile/${_id}`}
          className="btn w-100 fw-bold text-white btn-glow"
          style={{ backgroundColor: '#0f3460', borderRadius: '10px', padding: '10px' }}>
          View Profile →
        </Link>
      </div>
    </div>
  );
}

export default FreelancerCard;