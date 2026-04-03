import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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
      const flRes = await fetch('http://localhost:5000/api/freelancers', { credentials: 'include' });
      const allFreelancers = await flRes.json();
      const myProfile = allFreelancers.find(f => f.userId?._id === parsedUser.id);
      if (myProfile) {
        setFreelancer(myProfile);
        const inqRes = await fetch(`http://localhost:5000/api/inquiries/${myProfile._id}`, { credentials: 'include' });
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
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