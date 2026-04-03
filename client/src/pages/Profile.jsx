import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState({ clientName: '', clientEmail: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/freelancers/${id}`);
        const data = await res.json();
        setFreelancer(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  const handleInquiryChange = e => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async e => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiry, freelancerId: id })
      });
      if (res.ok) setSent(true);
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#0f3460' }}></div>
    </div>
  );

  if (!freelancer) return (
    <div className="container py-5 text-center">
      <h4>Freelancer not found</h4>
    </div>
  );

  const availabilityColor = { available: 'success', busy: 'danger', 'part-time': 'warning' };

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* Left — Profile Info */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <div className="text-center mb-3">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 80, height: 80, backgroundColor: '#0f3460', fontSize: 32, color: 'white' }}>
                {freelancer.userId?.name?.charAt(0) || 'F'}
              </div>
              <h4 className="fw-bold mb-1">{freelancer.userId?.name}</h4>
              <p className="text-muted small">{freelancer.userId?.email}</p>
              <span className={`badge bg-${availabilityColor[freelancer.availability]}`}>
                {freelancer.availability}
              </span>
            </div>
            <hr />
            <div className="mb-3">
              <p className="small fw-bold text-muted mb-1">BIO</p>
              <p className="small">{freelancer.bio || 'No bio provided'}</p>
            </div>
            <div className="mb-3">
              <p className="small fw-bold text-muted mb-1">SKILLS</p>
              <div>
                {freelancer.skills?.map((s, i) => (
                  <span key={i} className="badge me-1 mb-1" style={{ backgroundColor: '#e8f0fe', color: '#0f3460' }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <p className="small fw-bold text-muted mb-0">RATE</p>
                <p className="fw-bold" style={{ color: '#0f3460' }}>${freelancer.hourlyRate}/hr</p>
              </div>
              <div>
                <p className="small fw-bold text-muted mb-0">EXPERIENCE</p>
                <p className="fw-bold">{freelancer.experienceYears} years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Portfolio + Inquiry */}
        <div className="col-md-8">

          {/* Portfolio */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-4">Portfolio Case Studies</h5>
            {freelancer.portfolio?.length === 0 ? (
              <p className="text-muted">No portfolio items yet</p>
            ) : (
              <>
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4">
                  {freelancer.portfolio.map((item, i) => (
                    <li key={i} className="nav-item">
                      <button className={`nav-link ${activeTab === i ? 'active' : ''}`}
                        onClick={() => setActiveTab(i)}
                        style={{ color: activeTab === i ? '#0f3460' : '#666' }}>
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Active Tab Content */}
                {freelancer.portfolio[activeTab] && (() => {
                  const item = freelancer.portfolio[activeTab];
                  return (
                    <div>
                      <div className="mb-3">
                        <p className="small fw-bold text-muted mb-1">DESCRIPTION</p>
                        <p>{item.description}</p>
                      </div>
                      <div className="mb-3">
                        <p className="small fw-bold text-muted mb-1">TECH STACK</p>
                        <div>
                          {item.techStack?.map((t, i) => (
                            <span key={i} className="badge me-1" style={{ backgroundColor: '#0f3460', color: 'white' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <p className="small fw-bold text-muted mb-1">ROLE</p>
                            <p className="small mb-0">{item.role}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="p-3 rounded" style={{ backgroundColor: '#fff3cd' }}>
                            <p className="small fw-bold text-muted mb-1">CHALLENGES</p>
                            <p className="small mb-0">{item.challenges}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="p-3 rounded" style={{ backgroundColor: '#d1e7dd' }}>
                            <p className="small fw-bold text-muted mb-1">OUTCOME</p>
                            <p className="small mb-0">{item.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>

          {/* Inquiry Form */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
  <h5 className="fw-bold mb-4">Send an Inquiry</h5>

  {(() => {
    const stored = localStorage.getItem('nexhire_user');
    const loggedInUser = stored ? JSON.parse(stored) : null;

    if (!loggedInUser) {
      return (
        <div className="text-center py-4">
          <p className="text-muted mb-3">You need to be logged in to send an inquiry</p>
          <a href="/login" className="btn text-white fw-bold px-4"
            style={{ backgroundColor: '#0f3460', borderRadius: '8px' }}>
            Login or Register
          </a>
        </div>
      );
    }

    if (loggedInUser.role === 'freelancer') {
      return (
        <div className="alert alert-info mb-0">
          You are logged in as a freelancer. Only clients can send inquiries.
        </div>
      );
    }

    if (sent) {
      return (
        <div className="alert alert-success">
          ✅ Inquiry sent! Check your email for confirmation.
        </div>
      );
    }

    return (
      <form onSubmit={handleInquirySubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">Your Name</label>
            <input type="text" className="form-control" name="clientName"
              value={inquiry.clientName} onChange={handleInquiryChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Your Email</label>
            <input type="email" className="form-control" name="clientEmail"
              value={inquiry.clientEmail} onChange={handleInquiryChange} required />
          </div>
          <div className="col-12">
            <label className="form-label small fw-bold">Message</label>
            <textarea className="form-control" name="message" rows={4}
              placeholder="Describe your project..."
              value={inquiry.message} onChange={handleInquiryChange} required />
          </div>
          <div className="col-12">
            <button type="submit" className="btn text-white fw-bold px-4"
              style={{ backgroundColor: '#0f3460', borderRadius: '8px' }} disabled={sending}>
              {sending ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </div>
      </form>
    );
  })()}
</div>

        </div>
      </div>
    </div>
  );
}

export default Profile;