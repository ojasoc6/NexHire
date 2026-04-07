import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
    const [profileForm, setProfileForm] = useState({
    bio: '', skills: '', hourlyRate: '', experienceYears: '', availability: 'available'
    });
    const [portfolioForm, setPortfolioForm] = useState({
    title: '', description: '', techStack: '', role: '', challenges: '', outcome: ''
    });
    const [addingPortfolio, setAddingPortfolio] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('nexhire_user');
    if (!stored) { navigate('/login'); return; }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);
    if (parsedUser.role === 'freelancer') {
      fetchFreelancerDashboard(parsedUser);
    } else {
      fetchClientDashboard(parsedUser.email);
    }
  }, []);

  // Freelancer — sees incoming inquiries
  const fetchFreelancerDashboard = async (parsedUser) => {
  try {
    const flRes = await fetch('http://localhost:5000/api/freelancers/me', {
      credentials: 'include'
    });

    if (!flRes.ok) {
      const err = await flRes.text();
      console.error("Fetch failed:", err);
      setLoading(false); // ✅ IMPORTANT
      return;
    }

    const myProfile = await flRes.json();

    setFreelancer(myProfile);

    setProfileForm({
      bio: myProfile.bio || '',
      skills: (myProfile.skills || []).join(', '),
      hourlyRate: myProfile.hourlyRate || '',
      experienceYears: myProfile.experienceYears || '',
      availability: myProfile.availability || 'available'
    });

    const inqRes = await fetch(
      `http://localhost:5000/api/inquiries/${myProfile._id}`,
      { credentials: 'include' }
    );

    const inqData = await inqRes.json();
    setInquiries(inqData);

  } catch (err) {
    console.error("Error:", err);
  }

  setLoading(false); // ✅ ALWAYS RUN
};

  // Client — sees their sent inquiries by email
  const fetchClientDashboard = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/inquiries/client/${email}`, { credentials: 'include' });
      const data = await res.json();
      setInquiries(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateStatus = async (inquiryId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      setInquiries(prev => prev.map(inq =>
        inq._id === inquiryId ? { ...inq, status: newStatus } : inq
      ));
    } catch (err) { console.error(err); }
  };
  const saveProfile = async () => {
  setSaving(true);
  setMessage('');
  try {
        if (!freelancer?._id) {
          alert("Freelancer profile not loaded yet");
          return;
        }
    const res = await fetch(`http://localhost:5000/api/freelancers/${freelancer._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...profileForm,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        hourlyRate: Number(profileForm.hourlyRate),
        experienceYears: Number(profileForm.experienceYears)
      })
    });
   if (!res.ok) {
        const err = await res.text();
        console.error("Update failed:", err);
      }else {
          setMessage('Profile updated successfully!');
          setEditMode(false);
          fetchFreelancerDashboard(user);
        } 
  } catch (err) { console.error(err); }
  setSaving(false);
};

const savePortfolio = async () => {
  setSaving(true);
  setMessage('');
  try {
        if (!freelancer?._id) {
          alert("Freelancer profile not loaded yet");
          return;
        }
    const res = await fetch(`http://localhost:5000/api/freelancers/${freelancer._id}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...portfolioForm,
        techStack: portfolioForm.techStack.split(',').map(s => s.trim()).filter(Boolean)
      })
    });
    if (res.ok) {
      setMessage('Portfolio item added!');
      setAddingPortfolio(false);
      setPortfolioForm({ title: '', description: '', techStack: '', role: '', challenges: '', outcome: '' });
      fetchFreelancerDashboard(user);
    }
  } catch (err) { console.error(err); }
  setSaving(false);
};

  const statusColor = { sent: 'primary', viewed: 'warning', responded: 'info', accepted: 'success' };
  const nextStatus = { sent: 'viewed', viewed: 'responded', responded: 'accepted' };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#0f3460' }}></div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}!</p>
        </div>
        <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#0f3460' }}>
          {user?.role}
        </span>
      </div>
{/* Edit Profile — only for freelancers */}
{user?.role === 'freelancer' && (
  <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold mb-0">My Profile</h5>
      <button className="btn btn-sm"
        style={{ backgroundColor: '#0f3460', color: 'white', borderRadius: '8px' }}
        onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel' : '✏️ Edit Profile'}
      </button>
    </div>

    {message && <div className="alert alert-success py-2 small">{message}</div>}

    {!editMode ? (
      // View mode
      <div className="row g-3">
        <div className="col-md-8">
          <p className="small fw-bold text-muted mb-1">BIO</p>
          <p className="mb-3">{freelancer?.bio || 'No bio yet — click Edit Profile to add one'}</p>
          <p className="small fw-bold text-muted mb-1">SKILLS</p>
          <div className="mb-3">
            {freelancer?.skills?.length > 0
              ? freelancer.skills.map((s, i) => (
                <span key={i} className="badge me-1 mb-1"
                  style={{ backgroundColor: '#e8f0fe', color: '#0f3460' }}>{s}</span>
              ))
              : <span className="text-muted small">No skills added yet</span>
            }
          </div>
        </div>
        <div className="col-md-4">
          <p className="small fw-bold text-muted mb-1">HOURLY RATE</p>
          <p className="fw-bold" style={{ color: '#0f3460' }}>${freelancer?.hourlyRate || 0}/hr</p>
          <p className="small fw-bold text-muted mb-1">EXPERIENCE</p>
          <p>{freelancer?.experienceYears || 0} years</p>
          <p className="small fw-bold text-muted mb-1">AVAILABILITY</p>
          <p>{freelancer?.availability}</p>
        </div>
      </div>
    ) : (
      // Edit mode
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label small fw-bold">Bio</label>
          <textarea className="form-control" rows={3} value={profileForm.bio}
            onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
            placeholder="Tell clients about yourself..." />
        </div>
        <div className="col-12">
          <label className="form-label small fw-bold">Skills (comma separated)</label>
          <input type="text" className="form-control" value={profileForm.skills}
            onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })}
            placeholder="e.g. React, Node.js, MongoDB" />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-bold">Hourly Rate ($/hr)</label>
          <input type="number" className="form-control" value={profileForm.hourlyRate}
            onChange={e => setProfileForm({ ...profileForm, hourlyRate: e.target.value })}
            placeholder="e.g. 40" />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-bold">Experience (years)</label>
          <input type="number" className="form-control" value={profileForm.experienceYears}
            onChange={e => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
            placeholder="e.g. 3" />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-bold">Availability</label>
          <select className="form-select" value={profileForm.availability}
            onChange={e => setProfileForm({ ...profileForm, availability: e.target.value })}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="part-time">Part Time</option>
          </select>
        </div>
        <div className="col-12">
          <button className="btn text-white fw-bold px-4"
            style={{ backgroundColor: '#0f3460', borderRadius: '8px' }}
            onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    )}

    {/* Portfolio Section */}
    <hr className="my-4" />
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold mb-0">Portfolio Case Studies ({freelancer?.portfolio?.length || 0})</h6>
      <button className="btn btn-sm btn-outline-success"
        style={{ borderRadius: '8px' }}
        onClick={() => setAddingPortfolio(!addingPortfolio)}>
        {addingPortfolio ? 'Cancel' : '+ Add Project'}
      </button>
    </div>

    {/* Add Portfolio Form */}
    {addingPortfolio && (
      <div className="p-3 rounded mb-3" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">Project Title</label>
            <input type="text" className="form-control" value={portfolioForm.title}
              onChange={e => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
              placeholder="e.g. E-Commerce Platform" />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Tech Stack (comma separated)</label>
            <input type="text" className="form-control" value={portfolioForm.techStack}
              onChange={e => setPortfolioForm({ ...portfolioForm, techStack: e.target.value })}
              placeholder="e.g. React, Node.js, MongoDB" />
          </div>
          <div className="col-12">
            <label className="form-label small fw-bold">Description</label>
            <textarea className="form-control" rows={2} value={portfolioForm.description}
              onChange={e => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
              placeholder="What did you build?" />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Your Role</label>
            <input type="text" className="form-control" value={portfolioForm.role}
              onChange={e => setPortfolioForm({ ...portfolioForm, role: e.target.value })}
              placeholder="e.g. Full Stack Developer" />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Challenges</label>
            <input type="text" className="form-control" value={portfolioForm.challenges}
              onChange={e => setPortfolioForm({ ...portfolioForm, challenges: e.target.value })}
              placeholder="What was difficult?" />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Outcome</label>
            <input type="text" className="form-control" value={portfolioForm.outcome}
              onChange={e => setPortfolioForm({ ...portfolioForm, outcome: e.target.value })}
              placeholder="What was the result?" />
          </div>
          <div className="col-12">
            <button className="btn text-white fw-bold px-4"
              style={{ backgroundColor: '#198754', borderRadius: '8px' }}
              onClick={savePortfolio} disabled={saving}>
              {saving ? 'Saving...' : 'Add to Portfolio'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Existing Portfolio Items */}
    {freelancer?.portfolio?.length > 0 && (
      <div className="d-flex flex-column gap-2">
        {freelancer.portfolio.map((item, i) => (
          <div key={i} className="p-3 rounded border">
            <div className="d-flex justify-content-between mb-1">
              <h6 className="fw-bold mb-0">{item.title}</h6>
              <div>
                {item.techStack?.map((t, j) => (
                  <span key={j} className="badge me-1"
                    style={{ backgroundColor: '#0f3460', color: 'white' }}>{t}</span>
                ))}
              </div>
            </div>
            <p className="small text-muted mb-1">{item.description}</p>
            <div className="d-flex gap-3">
              <small><strong>Role:</strong> {item.role}</small>
              <small><strong>Outcome:</strong> {item.outcome}</small>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {user?.role === 'freelancer' ? (
          <>
            {[
              { label: 'Total Inquiries', value: inquiries.length, color: '#0f3460' },
              { label: 'Pending', value: inquiries.filter(i => i.status === 'sent').length, color: '#e94560' },
              { label: 'Accepted', value: inquiries.filter(i => i.status === 'accepted').length, color: '#198754' },
            ].map(({ label, value, color }) => (
              <div key={label} className="col-md-4">
                <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                  <h2 className="fw-bold mb-0" style={{ color }}>{value}</h2>
                  <p className="text-muted small mb-0">{label}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              { label: 'Inquiries Sent', value: inquiries.length, color: '#0f3460' },
              { label: 'In Progress', value: inquiries.filter(i => ['viewed', 'responded'].includes(i.status)).length, color: '#f4a261' },
              { label: 'Accepted', value: inquiries.filter(i => i.status === 'accepted').length, color: '#198754' },
            ].map(({ label, value, color }) => (
              <div key={label} className="col-md-4">
                <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px' }}>
                  <h2 className="fw-bold mb-0" style={{ color }}>{value}</h2>
                  <p className="text-muted small mb-0">{label}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Inquiries List */}
      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
  <h5 className="fw-bold mb-0">
    {user?.role === 'freelancer' ? 'Incoming Inquiries' : 'My Sent Inquiries'}
  </h5>
  <button className="btn btn-sm btn-outline-secondary"
    onClick={() => {
      setLoading(true);
      if (user?.role === 'freelancer') fetchFreelancerDashboard(user);
      else fetchClientDashboard(user.email);
    }}>
    🔄 Refresh
  </button>
</div>
        {inquiries.length === 0 ? (
          <p className="text-muted">
            {user?.role === 'freelancer' ? 'No inquiries yet' : "You haven't sent any inquiries yet"}
          </p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {inquiries.map(inq => (
              <div key={inq._id} className="p-3 rounded border">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    {user?.role === 'freelancer' ? (
                      <>
                        <h6 className="fw-bold mb-0">{inq.clientName}</h6>
                        <small className="text-muted">{inq.clientEmail}</small>
                      </>
                    ) : (
                      <>
                        <h6 className="fw-bold mb-0">Inquiry to freelancer</h6>
                        <small className="text-muted">{new Date(inq.createdAt).toLocaleDateString()}</small>
                      </>
                    )}
                  </div>
                  <span className={`badge bg-${statusColor[inq.status]}`}>{inq.status}</span>
                </div>
                <p className="small mb-2">{inq.message}</p>

                {/* Freelancer can update status, client just sees it */}
                {user?.role === 'freelancer' && nextStatus[inq.status] && (
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{new Date(inq.createdAt).toLocaleDateString()}</small>
                    <button className="btn btn-sm text-white"
                      style={{ backgroundColor: '#0f3460', borderRadius: '6px' }}
                      onClick={() => updateStatus(inq._id, nextStatus[inq.status])}>
                      Mark as {nextStatus[inq.status]}
                    </button>
                  </div>
                )}

                {/* Client sees status timeline */}
                {user?.role === 'client' && (
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {['sent', 'viewed', 'responded', 'accepted'].map((s, i) => (
                      <span key={s} className={`badge ${inq.status === s ? `bg-${statusColor[s]}` : 'bg-light text-muted'}`}>
                        {i + 1}. {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;