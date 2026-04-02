import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)', minHeight: '90vh' }}
        className="d-flex align-items-center">
        <div className="container text-center text-white py-5">
          <h1 className="display-3 fw-bold mb-4">
            Find the Right <span style={{ color: '#e94560' }}>Freelancer</span> for Your Project
          </h1>
          <p className="lead mb-5 opacity-75">
            Browse professional portfolios, filter by skills and budget, and connect with top freelancers — all in one place.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/browse" className="btn btn-lg px-5 py-3 fw-bold"
              style={{ backgroundColor: '#e94560', border: 'none', borderRadius: '50px', color: 'white' }}>
              Browse Freelancers
            </Link>
            <Link to="/login" className="btn btn-lg btn-outline-light px-5 py-3 fw-bold"
              style={{ borderRadius: '50px' }}>
              Join as Freelancer
            </Link>
          </div>
          {/* Stats */}
          <div className="row mt-5 justify-content-center">
            {[['50+', 'Freelancers'], ['100+', 'Projects Done'], ['4.8★', 'Avg Rating']].map(([num, label]) => (
              <div key={label} className="col-4 col-md-2">
                <h3 className="fw-bold" style={{ color: '#e94560' }}>{num}</h3>
                <p className="small opacity-75">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">How NexHire Works</h2>
        <div className="row g-4">
          {[
            { step: '01', title: 'Browse Profiles', desc: 'Explore freelancer portfolios with detailed case studies and skill sets' },
            { step: '02', title: 'Filter & Compare', desc: 'Filter by skills, experience, availability and hourly rate' },
            { step: '03', title: 'Send Inquiry', desc: 'Contact freelancers directly and track your inquiry status in real time' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="col-md-4 text-center">
              <div className="mb-3">
                <span className="display-4 fw-bold" style={{ color: '#e94560', opacity: 0.3 }}>{step}</span>
              </div>
              <h5 className="fw-bold">{title}</h5>
              <p className="text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;